import ComplaintManagementScreen from "../../components/complaints/ComplaintManagementScreen.jsx";

export default function ComplaintManagementPage() {
  return (
    <ComplaintManagementScreen
      description="Review complaints reported within your barangay and coordinate updates for local residents."
      eyebrow="Barangay Portal"
      role="barangay_admin"
      title="Barangay Complaints"
    />
  );
}
