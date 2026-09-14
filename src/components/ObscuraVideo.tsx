import { useState } from 'react';
import { PlayArrowRounded, HeadphonesRounded } from '@mui/icons-material';
import styles from '../../pages/thesis.module.css';

export function ObscuraVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.audiobook}>
      {playing ? (
        <iframe
          src="https://www.youtube-nocookie.com/embed/TqpJNWg7wQs?autoplay=1"
          title="The Obscura Covenant audiobook"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label="Play The Obscura Covenant audiobook on YouTube"
        >
          <HeadphonesRounded className={styles.headphones} />
          <span className={styles.audioLabel}>THE OBSCURA COVENANT</span>
          <strong>
            Close your eyes.
            <br />
            Open the argument.
          </strong>
          <span className={styles.play}>
            <PlayArrowRounded /> Play the audiobook
          </span>
          <small>YouTube loads only when you press play.</small>
        </button>
      )}
    </div>
  );
}
