import StatusMessage from "./StatusMessage.jsx";

export default function LoadingState({ message = "Loading..." }) {
  return <StatusMessage>{message}</StatusMessage>;
}
