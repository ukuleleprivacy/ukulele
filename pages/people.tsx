import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';

import { panelSx, SectionLabel } from '../src/components/ProtocolUI';
import { Layout } from '../src/Layout';

const people = [
  {
    name: 'Monero Time',
    handle: '@MoneroTime',
    initials: 'MT',
    profileUrl: 'https://x.com/MoneroTime',
    topics: ['Monero', 'Digital privacy', 'Operational security'],
    excerpt:
      'Monero Time shares commentary on financial privacy, cryptocurrency security, and digital sovereignty. The account discusses Monero alongside practical approaches to protecting sensitive information, including Tails, KeePassXC, and VeraCrypt. Its posts take a skeptical view of sweeping security claims and encourage readers to think carefully about their threat models.',
    quote: 'TailsOS + KeePassXC + VeraCrypt = true digital sovereignty!',
    postUrl: 'https://x.com/MoneroTime/status/2012627921110810638',
    postDate: 'January 17, 2026',
  },
];

export default function People() {
  return (
    <Layout>
      <Head>
        <title>People of note | Fiducaro</title>
        <meta name="description" content="People of note in the privacy world. Explore voices discussing financial privacy, digital sovereignty, and security, starting with Monero Time." />
      </Head>
      <Box component="main" sx={{ minHeight: 'calc(100vh - 70px)', bgcolor: '#292a2e' }}>
        <Box sx={{ maxWidth: 1520, mx: 'auto', px: { xs: 2.5, sm: 4, lg: 6 }, py: { xs: 6, md: 8 } }}>
          <SectionLabel>The privacy world</SectionLabel>
          <Typography component="h1" sx={{ mt: 1.5, fontSize: { xs: 44, md: 68 }, lineHeight: 1.05, letterSpacing: '-.045em', fontWeight: 600 }}>
            People of note
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 650, fontSize: { xs: 16, md: 18 } }}>
            Voices exploring financial privacy, personal security, and the freedom to control your digital life.
          </Typography>

          <Stack gap={3} sx={{ mt: { xs: 4, md: 6 } }}>
            {people.map((person) => (
              <Box component="article" key={person.handle} aria-labelledby={`person-${person.initials}`} sx={{ ...panelSx, p: { xs: 3, md: 5 }, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={3}>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Box aria-hidden="true" sx={{ width: 64, height: 64, display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: '50%', border: '1px solid rgba(167,215,160,.45)', bgcolor: 'rgba(167,215,160,.08)', color: 'primary.light', fontSize: 23, fontWeight: 600 }}>
                      {person.initials}
                    </Box>
                    <Box>
                      <Typography component="h2" id={`person-${person.initials}`} sx={{ fontSize: { xs: 25, md: 32 }, fontWeight: 600, letterSpacing: '-.025em' }}>{person.name}</Typography>
                      <Typography component="a" href={person.profileUrl} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontSize: 16, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>{person.handle}</Typography>
                    </Box>
                  </Stack>
                  <Button component="a" href={person.profileUrl} target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<OpenInNewRounded sx={{ fontSize: 17 }} />}>
                    View on X
                  </Button>
                </Stack>

                <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 3 }}>
                  {person.topics.map((topic) => <Box key={topic} component="span" sx={{ px: 1.5, py: .5, borderRadius: 4, border: '1px solid rgba(255,255,255,.14)', color: 'text.secondary', fontSize: 14 }}>{topic}</Box>)}
                </Stack>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: { xs: 3, md: 5 }, mt: 3.5, pt: 3.5, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box>
                    <SectionLabel>About the account</SectionLabel>
                    <Typography sx={{ mt: 1.5, fontSize: 16, lineHeight: 1.85, color: 'text.secondary' }}>{person.excerpt}</Typography>
                  </Box>
                  <Box component="figure" sx={{ m: 0, pl: 3, borderLeft: '2px solid', borderColor: 'primary.main' }}>
                    <SectionLabel>From the pinned post</SectionLabel>
                    <Typography component="blockquote" sx={{ mx: 0, my: 2, fontSize: { xs: 21, md: 24 }, fontWeight: 600, lineHeight: 1.5 }}>
                      “{person.quote}”
                    </Typography>
                    <Box component="figcaption">
                      <Typography color="text.secondary" sx={{ fontSize: 14 }}>{person.handle} · {person.postDate}</Typography>
                      <Button component="a" href={person.postUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewRounded sx={{ fontSize: 16 }} />} sx={{ mt: 1, px: 0, fontSize: 14 }}>Read the original post</Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}
