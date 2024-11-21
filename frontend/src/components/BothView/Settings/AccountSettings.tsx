import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Container, Image } from "react-bootstrap";
import LogoutButton from "../Logout/Logout";
import ProfilePicture from "./ProfilePicture";
import ApiService from "../../../utils/ApiService";

interface UserInfo {
  id: number;
  username: string;
  name: string;
  houseAddress?: string;
  email: string;
  mobileNumber: string;
  password: string;
}

const SettingsForm: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    username: "",
    name: "",
    houseAddress: "",
    mobileNumber: "",
    email: "",
    password: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentView, setCurrentView] = useState("settings");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch authenticated user information from the backend
    const fetchUserInfo = async () => {
      try {
        const response = await ApiService.fetchData<UserInfo>("tenant");
        console.log("User Information:", response.data);
        setUserInfo(response.data);
       } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!userInfo.username || !userInfo.password || !userInfo.email || !userInfo.name) {
      return "Udfyld venligst alle felter.";
    }
    if (!emailRegex.test(userInfo.email)) {
      return "Indtast en gyldig email.";
    }
    if (!passwordRegex.test(userInfo.password)) {
      return "Adgangskoden skal være mindst 8 tegn lang og inkludere både store og små bogstaver samt et tal.";
    }
    return null;
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      const error = validateForm();
      if (error) {
        setValidationError(error);
        return;
      }
      try {
        const response = await ApiService.editUser(userInfo.id, userInfo);
        console.log("Updated User Information:", response.data);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
    setIsEditing(!isEditing);
    setValidationError(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const renderContent = () => {
    switch (currentView) {
      case "settings":
        return (
          <Row>
            <Col md={8}>
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Brugernavn</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={userInfo.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={userInfo.username}
                  />
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>Navn</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={userInfo.name}
                  />
                </Form.Group>
                <Form.Group controlId="formHouseAddress">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="houseAddress"
                    value={userInfo.houseAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={userInfo.houseAddress}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={userInfo.email}
                  />
                </Form.Group>
                <Form.Group controlId="formmobileNumber">
                  <Form.Label>Telefon nummer</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    value={userInfo.mobileNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={userInfo.mobileNumber}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Adgangskode</Form.Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={userInfo.password}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={{ marginRight: '10px' }}
                      placeholder="Enter new password"
                    />
                    <Button variant="secondary" onClick={togglePasswordVisibility}>
                      {passwordVisible ? "Hide" : "Show"}
                    </Button>
                  </div>
                </Form.Group>
                {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
                <Button variant="primary" onClick={handleEditToggle}>
                  {isEditing ? "Save Changes" : "Edit"}
                </Button>
              </Form>
            </Col>
            <Col md={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProfilePicture />
            </Col>
          </Row>
        );
      case "text":
        return <div>"Et eller andet tekst IDK"</div>;
      case "notifications":
        return (
          <div>
            <Form.Check type="checkbox" label="Notification 1" />
            <Form.Check type="checkbox" label="Notification 2" />
            <Form.Check type="checkbox" label="Notification 3" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleCloseModal = () => setShowSuccessModal(false);

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Row style={{ width: '100%' }}>
        <Col md={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '20px' }}>
          <Button onClick={() => setCurrentView("settings")} style={{ marginBottom: '10px' }}>Din bruger</Button>
          <Button onClick={() => setCurrentView("text")} style={{ marginBottom: '10px' }}>Samtykke</Button>
          <Button onClick={() => setCurrentView("notifications")} style={{ marginBottom: '10px' }}>Notifikationer</Button>
          <LogoutButton />
        </Col>
        <Col md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          {renderContent()}
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Success Modal */}
          <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Ændringer er gemt</Modal.Title>
            </Modal.Header>
            <Modal.Body>Ændringer foretaget er opdateret!</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Luk
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsForm;