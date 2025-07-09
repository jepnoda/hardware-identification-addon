#include <napi.h>
#include "hardware_identifier.h"
#include <memory>

/**
 * @brief Global hardware identifier instance
 * Using smart pointer for automatic memory management
 */
static std::unique_ptr<HardwareIdentifier> g_hardwareIdentifier;

/**
 * @brief Initialize the hardware identifier
 * @param env N-API environment
 * @param info Function call info
 * @return Boolean indicating success
 */
Napi::Value Initialize(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            g_hardwareIdentifier = std::make_unique<HardwareIdentifier>();
        }
        
        bool success = g_hardwareIdentifier->Initialize();
        return Napi::Boolean::New(env, success);
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to initialize hardware identifier").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Clean up the hardware identifier
 * @param env N-API environment
 * @param info Function call info
 * @return Undefined
 */
Napi::Value Cleanup(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (g_hardwareIdentifier) {
            g_hardwareIdentifier->Cleanup();
            g_hardwareIdentifier.reset();
        }
        return env.Undefined();
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to cleanup hardware identifier").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get CPU ID
 * @param env N-API environment
 * @param info Function call info
 * @return String containing CPU ID
 */
Napi::Value GetCpuId(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string cpuId = g_hardwareIdentifier->GetCpuId();
        return Napi::String::New(env, cpuId);
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get CPU ID").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get motherboard serial number
 * @param env N-API environment
 * @param info Function call info
 * @return String containing motherboard serial
 */
Napi::Value GetMotherboardSerial(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string serial = g_hardwareIdentifier->GetMotherboardSerial();
        return Napi::String::New(env, serial);
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get motherboard serial").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get BIOS serial number
 * @param env N-API environment
 * @param info Function call info
 * @return String containing BIOS serial
 */
Napi::Value GetBiosSerial(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string serial = g_hardwareIdentifier->GetBiosSerial();
        return Napi::String::New(env, serial);
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get BIOS serial").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get disk drive serial numbers
 * @param env N-API environment
 * @param info Function call info
 * @return Array of strings containing disk serials
 */
Napi::Value GetDiskSerials(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::vector<std::string> serials = g_hardwareIdentifier->GetDiskSerials();
        Napi::Array result = Napi::Array::New(env, serials.size());
        
        for (size_t i = 0; i < serials.size(); i++) {
            result[i] = Napi::String::New(env, serials[i]);
        }
        
        return result;
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get disk serials").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get network adapter MAC addresses
 * @param env N-API environment
 * @param info Function call info
 * @return Array of strings containing MAC addresses
 */
Napi::Value GetMacAddresses(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::vector<std::string> addresses = g_hardwareIdentifier->GetMacAddresses();
        Napi::Array result = Napi::Array::New(env, addresses.size());
        
        for (size_t i = 0; i < addresses.size(); i++) {
            result[i] = Napi::String::New(env, addresses[i]);
        }
        
        return result;
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get MAC addresses").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get hardware fingerprint (combined hash)
 * @param env N-API environment
 * @param info Function call info
 * @return String containing hardware fingerprint
 */
Napi::Value GetHardwareFingerprint(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        std::string fingerprint = g_hardwareIdentifier->GetHardwareFingerprint();
        return Napi::String::New(env, fingerprint);
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get hardware fingerprint").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Get all hardware information at once
 * @param env N-API environment
 * @param info Function call info
 * @return Object containing all hardware information
 */
Napi::Value GetAllHardwareInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    try {
        if (!g_hardwareIdentifier) {
            Napi::TypeError::New(env, "Hardware identifier not initialized. Call initialize() first.").ThrowAsJavaScriptException();
            return env.Null();
        }
        
        // Create result object
        Napi::Object result = Napi::Object::New(env);
        
        // Get all hardware information
        std::string cpuId = g_hardwareIdentifier->GetCpuId();
        std::string motherboardSerial = g_hardwareIdentifier->GetMotherboardSerial();
        std::string biosSerial = g_hardwareIdentifier->GetBiosSerial();
        std::vector<std::string> diskSerials = g_hardwareIdentifier->GetDiskSerials();
        std::vector<std::string> macAddresses = g_hardwareIdentifier->GetMacAddresses();
        std::string fingerprint = g_hardwareIdentifier->GetHardwareFingerprint();
        
        // Set properties
        result.Set("cpuId", Napi::String::New(env, cpuId));
        result.Set("motherboardSerial", Napi::String::New(env, motherboardSerial));
        result.Set("biosSerial", Napi::String::New(env, biosSerial));
        result.Set("fingerprint", Napi::String::New(env, fingerprint));
        
        // Convert disk serials to array
        Napi::Array diskArray = Napi::Array::New(env, diskSerials.size());
        for (size_t i = 0; i < diskSerials.size(); i++) {
            diskArray[i] = Napi::String::New(env, diskSerials[i]);
        }
        result.Set("diskSerials", diskArray);
        
        // Convert MAC addresses to array
        Napi::Array macArray = Napi::Array::New(env, macAddresses.size());
        for (size_t i = 0; i < macAddresses.size(); i++) {
            macArray[i] = Napi::String::New(env, macAddresses[i]);
        }
        result.Set("macAddresses", macArray);
        
        return result;
    }
    catch (const std::exception& e) {
        Napi::TypeError::New(env, "Failed to get all hardware info").ThrowAsJavaScriptException();
        return env.Null();
    }
}

/**
 * @brief Initialize the addon module
 * @param env N-API environment
 * @param exports Module exports object
 * @return Module exports
 */
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    // Export individual functions
    exports.Set(Napi::String::New(env, "initialize"), 
                Napi::Function::New(env, Initialize));
    exports.Set(Napi::String::New(env, "cleanup"), 
                Napi::Function::New(env, Cleanup));
    exports.Set(Napi::String::New(env, "getCpuId"), 
                Napi::Function::New(env, GetCpuId));
    exports.Set(Napi::String::New(env, "getMotherboardSerial"), 
                Napi::Function::New(env, GetMotherboardSerial));
    exports.Set(Napi::String::New(env, "getBiosSerial"), 
                Napi::Function::New(env, GetBiosSerial));
    exports.Set(Napi::String::New(env, "getDiskSerials"), 
                Napi::Function::New(env, GetDiskSerials));
    exports.Set(Napi::String::New(env, "getMacAddresses"), 
                Napi::Function::New(env, GetMacAddresses));
    exports.Set(Napi::String::New(env, "getHardwareFingerprint"), 
                Napi::Function::New(env, GetHardwareFingerprint));
    exports.Set(Napi::String::New(env, "getAllHardwareInfo"), 
                Napi::Function::New(env, GetAllHardwareInfo));
    
    return exports;
}

// Register the addon
NODE_API_MODULE(hardware_id_addon, Init)
