import { PrivacyPage } from '../src/components/PrivacyPage';

// Preserve bookmarked SEND links while sharing the same live workflow.
export default function Platform() {
  return <PrivacyPage initialTab="send" />;
}
