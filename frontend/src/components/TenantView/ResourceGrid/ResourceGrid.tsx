import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import ApiService from "../../../utils/ApiService";
import { ResourceType } from "../../../utils/EnumSupport";
import Resource from "../../modelInterfaces/Resource";
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"; // Add the navigate hook

const mapToResourceType = (type: string | null | undefined): ResourceType | undefined => {
  if (type) {
    const upperCaseType = type.toUpperCase();
    if (upperCaseType in ResourceType) {
      return ResourceType[upperCaseType as keyof typeof ResourceType];
    }
  }
  console.error("Invalid resource type:", type);
  return undefined;
};

const ResourceGrid: React.FC = () => {
  const [tools, setTools] = useState<Resource[]>([]);
  const [hospitalities, setHospitalities] = useState<Resource[]>([]);
  const [otherResources, setOtherResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<string>('tools'); // Track the active tab
  const [bookingCount, setBookingCount] = useState<number>(0); // Track booking count
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check sessionStorage for booking count when the component mounts
    const storedBookingCount = sessionStorage.getItem("bookingCount");
    if (storedBookingCount) {
      setBookingCount(Number(storedBookingCount)); // Set the count from sessionStorage
    }

    const fetchResources = async () => {
      try {
        const toolsResponse = await ApiService.fetchResources(ResourceType.TOOL);
        const mappedTools = toolsResponse.data.map((resource: Resource) => ({
          ...resource,
          type: mapToResourceType(resource.type),
        }));
        setTools(mappedTools);

        const utilitiesResponse = await ApiService.fetchResources(ResourceType.UTILITY);
        const mappedUtilities = utilitiesResponse.data.map((resource: Resource) => ({
          ...resource,
          type: mapToResourceType(resource.type),
        }));
        setOtherResources(mappedUtilities);

        const hospitalitiesResponse = await ApiService.fetchResources(ResourceType.HOSPITALITY);
        const mappedHospitalities = hospitalitiesResponse.data.map((resource: Resource) => ({
          ...resource,
          type: mapToResourceType(resource.type),
        }));
        setHospitalities(mappedHospitalities);
      } catch (error) {
        console.error("Error fetching resources", error);
      }
    };

    fetchResources();
  }, []);

  // Update booking count logic (this would normally come from your sessionStorage or state)
  useEffect(() => {
    const handleBookingUpdated = () => {
      const newBookingCount = bookingCount + 1;
      setBookingCount(newBookingCount); // Update state
      sessionStorage.setItem("bookingCount", newBookingCount.toString()); // Store the count in sessionStorage
    };

    window.addEventListener("bookingsUpdated", handleBookingUpdated);
    return () => {
      window.removeEventListener("bookingsUpdated", handleBookingUpdated);
    };
  }, [bookingCount]);

  // Dynamically set the active class for the tab header
  const getActiveTabClass = (tab: string) => (activeTab === tab ? 'active-tab' : '');

  return (
    <div>
      {/* Resource Categories */}
      <Tabs 
        activeKey={activeTab} 
        onSelect={(key) => setActiveTab(key!)}
        id="resource-tabs" 
        className="mb-3"
      >
        <Tab 
          eventKey="tools" 
          title={<span className={`resource-heading ${getActiveTabClass('tools')}`}>Værktøj</span>}
        >
          <div className="row">
            {tools.length > 0 ? (
              tools.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <p>No tools available.</p>
            )}
          </div>
        </Tab>
        <Tab 
          eventKey="hospitalities" 
          title={<span className={`resource-heading ${getActiveTabClass('hospitalities')}`}>Gæstehuse & Lokaler</span>}
        >
          <div className="row">
            {hospitalities.length > 0 ? (
              hospitalities.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <p>No guest houses available.</p>
            )}
          </div>
        </Tab>
        <Tab 
          eventKey="others" 
          title={<span className={`resource-heading ${getActiveTabClass('others')}`}>Andet</span>}
        >
          <div className="row">
            {otherResources.length > 0 ? (
              otherResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <p>No other resources available.</p>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Conditionally render the "Se Reservationer" button at the top right */}
      {bookingCount > 0 && (
        <div className="mt-4">
          <button 
            className="btn btn-success d-flex align-items-center" 
            style={{
              position: 'absolute',
              top: '90px',
              right: '20px',
            }}
            onClick={() => navigate("/reservation-overblik")}
          >
            Se Reservationer
            <span className="badge bg-danger ms-2">{bookingCount}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;
