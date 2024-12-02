package com.auu_sw3_6.Himmerland_booking_software.api.controller;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.auu_sw3_6.Himmerland_booking_software.api.model.Tenant;
import com.auu_sw3_6.Himmerland_booking_software.service.TenantService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class TenantControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TenantService userService;

  @Autowired
  private ObjectMapper objectMapper;

  private Tenant testUser;

  @BeforeEach
  public void setUp() {
    testUser = new Tenant();
    testUser.setId(1L);
    testUser.setName("TenatControllerTest");
    testUser.setMobileNumber("+4588888888");
    testUser.setEmail("testEmail@gmail.com");
    testUser.setUsername("testTenat");
    testUser.setPassword("rawPassword123");

    userService.createUser(testUser, null);
  }

  
  /* Den her har brug for en form for test database. 
  @Test
  public void createUser_shouldReturnCreated() throws Exception {
    mockMvc.perform(post("/api/tenant")
        .contentType("application/json")
        .content(objectMapper.writeValueAsString(testUser)))
        .andExpect(status().isCreated());
  }
*/


  // /api/tenat GET tests

/*   @Test <------------------------------------------------------------------------------------------ Fix this test
  @WithMockUser(username = "testTenat", roles = { "TENANT" })
  public void getUser_shouldReturnCurrentUser() throws Exception {
    MvcResult result = mockMvc.perform(get("/api/tenant"))
        .andExpect(status().isOk())
        .andReturn();

    String jsonResponse = result.getResponse().getContentAsString();
    Tenant responseTenant = objectMapper.readValue(jsonResponse, Tenant.class);

    assertEquals(testUser.getName(), responseTenant.getName());
    assertEquals(testUser.getMobileNumber(), responseTenant.getMobileNumber());
    assertEquals(testUser.getEmail(), responseTenant.getEmail());
    assertEquals(testUser.getUsername(), responseTenant.getUsername());
  } */

  // This test is not applicable to the current implementation, returning 404
  // instead of 401, fix
  /*
   @Test
   public void getUser_withoutAuthorization_shouldReturnUnauthorized() throws
   Exception {
   mockMvc.perform(get("/api/tenant"))
   .andExpect(status().isUnauthorized());
   }

  @Test
  @WithMockUser(username = "testTenat", roles = { "TENANT" })
  public void getUser_withInvalidRole_shouldReturnForbidden() throws Exception {
    MvcResult result = mockMvc.perform(get("/api/tenant").with(user("testTenat").roles("ADMIN")))
        .andExpect(status().isForbidden()).andReturn();

    // String jsonResponse = result.getResponse().getContentAsString();
    // ErrorResponse errorResponse = objectMapper.readValue(jsonResponse, ErrorResponse.class);

    // assertEquals("Access denied", errorResponse.getMessage()); WIP
    // assertEquals(403, errorResponse.getStatus()); WIP

  }

/*   @Test <------------------------------------------------------------------------------------------ Fix this test
  @WithMockUser(username = "no", roles = { "TENANT" })
  public void getUser_withInvalidUsername_shouldReturnNotFound() throws Exception {
    MvcResult result = mockMvc.perform(get("/api/tenant"))
        .andExpect(status().isNotFound())
        .andReturn();

    String jsonResponse = result.getResponse().getContentAsString();
    ErrorResponse errorResponse = objectMapper.readValue(jsonResponse, ErrorResponse.class);

    assertEquals("User not found", errorResponse.getMessage());
    assertEquals(404, errorResponse.getStatus());
  } */
}
