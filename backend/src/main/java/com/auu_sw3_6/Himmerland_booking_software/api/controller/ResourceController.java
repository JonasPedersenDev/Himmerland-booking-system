package com.auu_sw3_6.Himmerland_booking_software.api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auu_sw3_6.Himmerland_booking_software.api.model.Resource;
import com.auu_sw3_6.Himmerland_booking_software.service.ResourceService;

import jakarta.annotation.security.PermitAll;

@RestController
public class ResourceController {

    private final ResourceService resourceService;

    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }
    
    @PermitAll
    @GetMapping("/api/resource")
    public ResponseEntity<Resource> getResource(@RequestParam Long id) {
        Optional<Resource> resource = resourceService.getResource(id);
        return resource.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PermitAll
    @GetMapping("/api/resources")
    public ResponseEntity<List<Resource>> getResources() {
        List<Resource> resources = resourceService.getResources();
        if (resources.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.ok(resources);
        }
    }

    @PermitAll
    @PostMapping("/api/resources")
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        resourceService.addResource(resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

}
