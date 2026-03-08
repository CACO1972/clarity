
/**
 * Service to handle clinical plan delivery via WhatsApp Business API
 * and track patient engagement events.
 */
import { Marker } from '../types';

export interface PatientEngagementStats {
  opens: number;
  videoPlays: number;
  timeOnImage: number; // in minutes
  lastAccessed: string | null;
}

/**
 * Sends the smart plan to the patient via WhatsApp.
 * Dynamically constructs a unique tracking URL for the patient.
 */
export const sendSmartPlan = async (
  patientName: string, 
  phoneNumber: string, 
  patientId: string, 
  markers: Marker[]
): Promise<boolean> => {
  // Generate a dynamic URL based on patient metadata and plan contents
  const baseUrl = "https://citypro.dental/plan";
  const timestamp = new Date().getTime();
  const markerCount = markers.length;
  const planHash = Math.random().toString(36).substring(7).toUpperCase();
  
  // Construct a URL that feels personalized and secure
  const planUrl = `${baseUrl}/${patientId}?ref=${planHash}&ts=${timestamp}&items=${markerCount}`;

  console.log(`[WhatsApp API] Initializing secure handshake with +${phoneNumber}`);
  console.log(`[WhatsApp API] Sending template "elite_plan_delivery"`);
  console.log(`[WhatsApp API] Content: Hola ${patientName}, tu plan P4 está listo en ${planUrl}`);

  // Simulate network latency for the API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real environment, this would hit the Meta/Facebook Graph API:
  // POST https://graph.facebook.com/v18.0/${process.env.WA_PHONE_ID}/messages
  
  return true;
};

export const fetchInitialStats = (): PatientEngagementStats => {
  return {
    opens: 12,
    videoPlays: 5,
    timeOnImage: 8.4,
    lastAccessed: "2 mins ago"
  };
};
