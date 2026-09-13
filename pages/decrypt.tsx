import { PrivacyPage } from '../src/components/PrivacyPage';

// Preserve bookmarked Decrypt links while sharing the same live workflow.
export default function Decrypt() {
  return <PrivacyPage initialTab="decrypt" />;
}
