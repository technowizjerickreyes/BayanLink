import StatusMessage from "./StatusMessage.jsx";

export default function ErrorState({ message = "Something went wrong." }) {
  return <StatusMessage type="error">{message}</StatusMessage>;
}
