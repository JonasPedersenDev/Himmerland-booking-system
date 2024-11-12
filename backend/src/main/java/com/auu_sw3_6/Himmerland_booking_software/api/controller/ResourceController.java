package com.auu_sw3_6.Himmerland_booking_software.api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auu_sw3_6.Himmerland_booking_software.api.model.BookingDate;
import com.auu_sw3_6.Himmerland_booking_software.api.model.Resource;
import com.auu_sw3_6.Himmerland_booking_software.exception.ResourceNotFoundException;
import com.auu_sw3_6.Himmerland_booking_software.service.BookingService;
import com.auu_sw3_6.Himmerland_booking_software.service.ResourceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("api/resource")
public abstract class ResourceController<T extends Resource> {

  protected final ResourceService<T> resourceService;
  protected final BookingService bookingService;

  @Autowired
  public ResourceController(ResourceService<T> resourceService, BookingService bookingService) {
    this.resourceService = resourceService;
    this.bookingService = bookingService;
  }

  @Operation(summary = "Get a resource by ID", description = "Retrieve details of a specific resource by its ID")
  @GetMapping(value = "/{id}", produces = "application/json")
  public ResponseEntity<T> getResourceById(@PathVariable Long id) {
    try {
        Optional<T> resource = resourceService.getResourceById(id);
        return resource.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    } catch (ResourceNotFoundException e) {
        System.out.println("No resources found: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    } catch (Exception e) {
        System.out.println("An unexpected error occurred: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

  @Operation(summary = "Get all resources", description = "Retrieve a list of all available resources")
  @GetMapping(value = "/get-all", produces = "application/json")
  public ResponseEntity<List<T>> getResources() {
    List<T> resources = resourceService.getAllResources();
    if (resources.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    } else {
      return ResponseEntity.ok(resources);
    }
  }

  @Operation(summary = "Add a new resource", description = "Create and add a new resource to the system")
  @PostMapping(value = "/add", produces = "application/json")
  public ResponseEntity<T> addResource(@RequestBody T resource) {
    resourceService.createResource(resource, null);
    return ResponseEntity.status(HttpStatus.CREATED).body(resource);
  }

  @Operation(summary = "Get confirmed booked dates for a resource", description = "Retrieve an array of dates, along with the amount booked on that date when a specific resource is booked")
  @GetMapping(value = "/{id}/booked-dates", produces = "application/json")
  public ResponseEntity<List<BookingDate>> getReservedDates(@PathVariable Long id) {
    Resource resource = resourceService.getResourceById(id).orElse(null);
    List<BookingDate> reservedDates = bookingService.getBookedDatesWithAmount(resource);
    return ResponseEntity.ok(reservedDates);
  }

  @Operation(summary = "Delete a resource", description = "Remove a resource from the system by its ID")
  @DeleteMapping("/api/resource/{resourceId}")
  public ResponseEntity<Void> deleteResource(@PathVariable long resourceId) {
    boolean isDeleted = resourceService.deleteResource(resourceId);
    if (isDeleted) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @Operation(summary = "Update a resource", description = "Update the details of an existing resource") //NOT WORKING
  @PutMapping(value = "/update/{updatedResourceId}", produces = "application/json")
  public ResponseEntity<T> updateResource(@RequestBody T updatedResource, @PathVariable long updatedResourceId) {
    T resource = resourceService.updateResource(updatedResource, updatedResourceId);
    return ResponseEntity.ok(resource);
  }

}