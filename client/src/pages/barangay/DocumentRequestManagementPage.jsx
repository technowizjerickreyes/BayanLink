import DocumentRequestManagementScreen from "../../components/requests/DocumentRequestManagementScreen.jsx";

export default function DocumentRequestManagementPage() {
  return (
    <DocumentRequestManagementScreen
      description="Handle barangay-scoped requests submitted by residents in your assigned barangay."
      eyebrow="Barangay Portal"
      role="barangay_admin"
      title="Barangay Document Requests"
    />
  );
}
