#include "hardware_identifier.h"
#include <windows.h>
#include <comdef.h>
#include <wbemidl.h>
#include <sstream>
#include <iomanip>
#include <algorithm>

// Link with COM libraries
#pragma comment(lib, "wbemuuid.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "oleaut32.lib")

/**
 * @brief Constructor - Initialize member variables
 */
HardwareIdentifier::HardwareIdentifier() 
    : m_isInitialized(false)
    , m_pWbemLocator(nullptr)
    , m_pWbemServices(nullptr) {
}

/**
 * @brief Destructor - Clean up resources
 */
HardwareIdentifier::~HardwareIdentifier() {
    Cleanup();
}

/**
 * @brief Initialize COM and WMI services
 * @return true if successful, false otherwise
 */
bool HardwareIdentifier::Initialize() {
    if (m_isInitialized) {
        return true;
    }

    // Initialize COM
    HRESULT hres = CoInitializeEx(0, COINIT_MULTITHREADED);
    if (FAILED(hres)) {
        return false;
    }

    // Set COM security levels
    hres = CoInitializeSecurity(
        NULL,                        // Security descriptor
        -1,                          // COM authentication
        NULL,                        // Authentication services
        NULL,                        // Reserved
        RPC_C_AUTHN_LEVEL_NONE,     // Default authentication
        RPC_C_IMP_LEVEL_IMPERSONATE, // Default Impersonation
        NULL,                        // Authentication info
        EOAC_NONE,                   // Additional capabilities
        NULL                         // Reserved
    );

    if (FAILED(hres)) {
        CoUninitialize();
        return false;
    }

    // Obtain the initial locator to WMI
    IWbemLocator* pLoc = nullptr;
    hres = CoCreateInstance(
        CLSID_WbemLocator,
        0,
        CLSCTX_INPROC_SERVER,
        IID_IWbemLocator,
        (LPVOID*)&pLoc
    );

    if (FAILED(hres)) {
        CoUninitialize();
        return false;
    }

    // Connect to WMI through the IWbemLocator::ConnectServer method
    IWbemServices* pSvc = nullptr;
    hres = pLoc->ConnectServer(
        _bstr_t(L"ROOT\\CIMV2"),    // Object path of WMI namespace
        NULL,                       // User name. NULL = current user
        NULL,                       // User password. NULL = current
        0,                          // Locale. NULL indicates current
        NULL,                       // Security flags
        0,                          // Authority (for example, Kerberos)
        0,                          // Context object
        &pSvc                       // pointer to IWbemServices proxy
    );

    if (FAILED(hres)) {
        pLoc->Release();
        CoUninitialize();
        return false;
    }

    // Set security levels on the proxy
    hres = CoSetProxyBlanket(
        pSvc,                        // Indicates the proxy to set
        RPC_C_AUTHN_WINNT,           // RPC_C_AUTHN_xxx
        RPC_C_AUTHZ_NONE,            // RPC_C_AUTHZ_xxx
        NULL,                        // Server principal name
        RPC_C_AUTHN_LEVEL_CALL,      // RPC_C_AUTHN_LEVEL_xxx
        RPC_C_IMP_LEVEL_IMPERSONATE, // RPC_C_IMP_LEVEL_xxx
        NULL,                        // client identity
        EOAC_NONE                    // proxy capabilities
    );

    if (FAILED(hres)) {
        pSvc->Release();
        pLoc->Release();
        CoUninitialize();
        return false;
    }

    // Store the pointers
    m_pWbemLocator = pLoc;
    m_pWbemServices = pSvc;
    m_isInitialized = true;

    return true;
}

/**
 * @brief Clean up COM resources
 */
void HardwareIdentifier::Cleanup() {
    if (m_pWbemServices) {
        static_cast<IWbemServices*>(m_pWbemServices)->Release();
        m_pWbemServices = nullptr;
    }

    if (m_pWbemLocator) {
        static_cast<IWbemLocator*>(m_pWbemLocator)->Release();
        m_pWbemLocator = nullptr;
    }

    if (m_isInitialized) {
        CoUninitialize();
        m_isInitialized = false;
    }
}

/**
 * @brief Execute WMI query and return string result
 */
std::string HardwareIdentifier::ExecuteWmiQuery(const std::string& wmiClass, 
                                               const std::string& property, 
                                               int index) {
    if (!m_isInitialized) {
        return "";
    }

    IWbemServices* pSvc = static_cast<IWbemServices*>(m_pWbemServices);
    
    // Build WQL query
    std::string query = "SELECT " + property + " FROM " + wmiClass;
    
    // Execute the query
    IEnumWbemClassObject* pEnumerator = nullptr;
    HRESULT hres = pSvc->ExecQuery(
        bstr_t("WQL"),
        bstr_t(query.c_str()),
        WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY,
        NULL,
        &pEnumerator
    );

    if (FAILED(hres)) {
        return "";
    }

    // Get the data from the query
    IWbemClassObject* pclsObj = nullptr;
    ULONG uReturn = 0;
    std::string result = "";

    // Skip to the requested index
    for (int i = 0; i <= index; i++) {
        if (pclsObj) {
            pclsObj->Release();
            pclsObj = nullptr;
        }

        hres = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
        if (0 == uReturn || FAILED(hres)) {
            break;
        }
    }

    if (pclsObj && uReturn > 0) {
        VARIANT vtProp;
        VariantInit(&vtProp);

        // Get the value of the property
        hres = pclsObj->Get(_bstr_t(property.c_str()), 0, &vtProp, 0, 0);
        if (SUCCEEDED(hres) && vtProp.vt == VT_BSTR && vtProp.bstrVal) {
            result = WideStringToString(std::wstring(vtProp.bstrVal));
        }

        VariantClear(&vtProp);
        pclsObj->Release();
    }

    pEnumerator->Release();
    return result;
}

/**
 * @brief Execute WMI query and return multiple string results
 */
std::vector<std::string> HardwareIdentifier::ExecuteWmiQueryMultiple(const std::string& wmiClass, 
                                                                    const std::string& property) {
    std::vector<std::string> results;
    
    if (!m_isInitialized) {
        return results;
    }

    IWbemServices* pSvc = static_cast<IWbemServices*>(m_pWbemServices);
    
    // Build WQL query
    std::string query = "SELECT " + property + " FROM " + wmiClass;
    
    // Execute the query
    IEnumWbemClassObject* pEnumerator = nullptr;
    HRESULT hres = pSvc->ExecQuery(
        bstr_t("WQL"),
        bstr_t(query.c_str()),
        WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY,
        NULL,
        &pEnumerator
    );

    if (FAILED(hres)) {
        return results;
    }

    // Get all data from the query
    IWbemClassObject* pclsObj = nullptr;
    ULONG uReturn = 0;

    while (pEnumerator) {
        hres = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
        if (0 == uReturn || FAILED(hres)) {
            break;
        }

        VARIANT vtProp;
        VariantInit(&vtProp);

        // Get the value of the property
        hres = pclsObj->Get(_bstr_t(property.c_str()), 0, &vtProp, 0, 0);
        if (SUCCEEDED(hres) && vtProp.vt == VT_BSTR && vtProp.bstrVal) {
            std::string value = WideStringToString(std::wstring(vtProp.bstrVal));
            if (!value.empty()) {
                results.push_back(value);
            }
        }

        VariantClear(&vtProp);
        pclsObj->Release();
    }

    pEnumerator->Release();
    return results;
}

/**
 * @brief Convert wide string to UTF-8 string
 */
std::string HardwareIdentifier::WideStringToString(const std::wstring& wstr) {
    if (wstr.empty()) {
        return "";
    }

    int size_needed = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(size_needed, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], size_needed, NULL, NULL);
    return strTo;
}

/**
 * @brief Get CPU identifier (processor ID)
 */
std::string HardwareIdentifier::GetCpuId() {
    return ExecuteWmiQuery("Win32_Processor", "ProcessorId", 0);
}

/**
 * @brief Get motherboard serial number
 */
std::string HardwareIdentifier::GetMotherboardSerial() {
    return ExecuteWmiQuery("Win32_BaseBoard", "SerialNumber", 0);
}

/**
 * @brief Get BIOS serial number
 */
std::string HardwareIdentifier::GetBiosSerial() {
    return ExecuteWmiQuery("Win32_BIOS", "SerialNumber", 0);
}

/**
 * @brief Get disk drive serial numbers
 */
std::vector<std::string> HardwareIdentifier::GetDiskSerials() {
    return ExecuteWmiQueryMultiple("Win32_PhysicalMedia", "SerialNumber");
}

/**
 * @brief Get network adapter MAC addresses
 */
std::vector<std::string> HardwareIdentifier::GetMacAddresses() {
    return ExecuteWmiQueryMultiple("Win32_NetworkAdapter", "MACAddress");
}

/**
 * @brief Generate a simple hash from input string
 */
std::string HardwareIdentifier::GenerateHash(const std::string& input) {
    // Simple hash algorithm for demonstration
    // In production, consider using a cryptographic hash like SHA-256
    std::hash<std::string> hasher;
    size_t hashValue = hasher(input);
    
    std::stringstream ss;
    ss << std::hex << hashValue;
    return ss.str();
}

/**
 * @brief Generate a combined hardware fingerprint
 */
std::string HardwareIdentifier::GetHardwareFingerprint() {
    std::stringstream fingerprint;
    
    // Combine multiple hardware identifiers
    fingerprint << GetCpuId();
    fingerprint << "|" << GetMotherboardSerial();
    fingerprint << "|" << GetBiosSerial();
    
    // Add first disk serial if available
    auto diskSerials = GetDiskSerials();
    if (!diskSerials.empty()) {
        fingerprint << "|" << diskSerials[0];
    }
    
    // Add first MAC address if available
    auto macAddresses = GetMacAddresses();
    if (!macAddresses.empty()) {
        fingerprint << "|" << macAddresses[0];
    }
    
    // Generate hash of the combined string
    return GenerateHash(fingerprint.str());
}
