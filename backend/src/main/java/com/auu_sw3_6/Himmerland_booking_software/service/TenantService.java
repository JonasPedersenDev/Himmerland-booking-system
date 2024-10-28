package com.auu_sw3_6.Himmerland_booking_software.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.auu_sw3_6.Himmerland_booking_software.api.model.Tenant;
import com.auu_sw3_6.Himmerland_booking_software.api.repository.TenantRepository;

@Service
public class TenantService extends UserService<Tenant> {
    
    @Autowired
    public TenantService(TenantRepository tenantRepository, PictureService profilePictureService, PasswordEncoder passwordEncoder) {
        super(tenantRepository, profilePictureService, passwordEncoder);
    }

    public Tenant createTenant(Tenant tenant, MultipartFile profilePicture) {
        return createUser(tenant, profilePicture);
    }
}
