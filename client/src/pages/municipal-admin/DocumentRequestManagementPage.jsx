import DocumentRequestManagementScreen from "../../components/requests/DocumentRequestManagementScreen.jsx";

export default function DocumentRequestManagementPage() {
  return (
    <DocumentRequestManagementScreen
      description="Review municipality-scoped and escalated document requests, update their workflow, and set release readiness."
      eyebrow="Municipal Admin Portal"
      role="municipal_admin"
      title="Document Request Management"
    />
  );
}
