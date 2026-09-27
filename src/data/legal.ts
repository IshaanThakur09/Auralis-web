// Generated from the same text as privacy/index.html and terms/index.html. Keep all three in sync.
export type LegalPart = string | { ul: string[] };
export type LegalSection = { heading: string; parts: LegalPart[] };

export const PRIVACY_DATE = "Effective Date: September 28, 2026";
export const TERMS_DATE = "Last updated: September 28, 2026";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    "heading": "1. Introduction",
    "parts": [
      "Auralis (\"we\", \"our\", or \"the app\") is a free, open-source music player for Android that streams from YouTube Music. This policy explains what data the app handles, where it goes, and how you can delete it.",
      "<strong class=\"text-bone-50\">In short:</strong> Auralis has no advertising or analytics SDK. Most library data stays on your phone. Signing in is optional. Streaming, lyrics, update notifications and optional integrations still involve network services, as described below."
    ]
  },
  {
    "heading": "2. Data That Stays on Your Phone",
    "parts": [
      "Your library, playlists, liked songs, play history, listening stats, settings, song cache, downloads and saved lyrics are stored on your device. Without sign-in, your library and stats are not backed up to your account. Searches, playback, lyrics lookups, update notifications and optional features still contact external services. Listen Together uses Firebase even if you have not signed in with Google or email."
    ]
  },
  {
    "heading": "3. If You Sign In (Optional)",
    "parts": [
      "You can sign in with Google, or with an email and password, through Firebase Authentication (a Google service). When you're signed in, the following is stored in Google Firebase so you can restore it on a new phone:",
      {
        "ul": [
          "Your account details: email address, name and profile photo from your sign-in.",
          "Your playlists, liked songs and saved artists.",
          "Your listening stats: which songs you played, when, and for how long."
        ]
      },
      "We use this account data for sign-in, backup and restoration, and do not sell it or use it for advertising. Google Firebase processes it to provide those features. Listen Together room data is described separately below."
    ]
  },
  {
    "heading": "4. Listen Together",
    "parts": [
      "When you create or join a Listen Together room, your display name, the room code, the song playing, playback position, the room's queue and any song recommendations are stored in Firebase and visible to everyone in the room. When the host closes a room, it's deleted along with its members and recommendations (Auralis 1.1.1 and later). A room that was never closed properly, for example because the app was force-stopped, may stay until we remove it."
    ]
  },
  {
    "heading": "5. Services the App Connects To",
    "parts": [
      "To play music and provide its features, Auralis sends some information to these services. Each has its own privacy policy.",
      {
        "ul": [
          "<strong class=\"text-bone-50\">YouTube and YouTube Music:</strong> your searches and the songs you play, to find and stream music. See the <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://www.youtube.com/t/terms\" target=\"_blank\" rel=\"noopener noreferrer\">YouTube Terms of Service</a> and the <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://policies.google.com/privacy\" target=\"_blank\" rel=\"noopener noreferrer\">Google Privacy Policy</a>.",
          "<strong class=\"text-bone-50\">Lyrics services</strong> (such as LRCLIB, Musixmatch, NetEase, KuGou, Genius and JioSaavn): the song's title, artist, album and length, to find lyrics.",
          "<strong class=\"text-bone-50\">Apple iTunes Search:</strong> the song's title and artist, to find its album.",
          "<strong class=\"text-bone-50\">Wikipedia:</strong> an artist's name, to find an artist photo.",
          "<strong class=\"text-bone-50\">Song recognition (optional):</strong> when you use it, a short acoustic fingerprint of what the microphone hears (not the recording itself) is sent to Shazam to identify the song.",
          "<strong class=\"text-bone-50\">Voice search (optional):</strong> speech is handled by the Android speech recognition service selected on your device. Depending on the device and service, recognition may happen on-device or through that provider's servers.",
          "<strong class=\"text-bone-50\">Discord (optional):</strong> if you connect Discord, the song you're playing is shown on your Discord profile. Discord sign-in is handled by Discord's official SDK.",
          "<strong class=\"text-bone-50\">AI lyrics translation (optional):</strong> the song's lyrics are sent to the AI provider you choose (for example OpenAI, Anthropic, Google Gemini or DeepL), using your own API key. Your key is stored only on your phone.",
          "<strong class=\"text-bone-50\">Playlist import (optional):</strong> the Spotify or YouTube playlist links you paste are read from those services. For your own YouTube playlists, the app uses the Google access you grant, which you can revoke on your <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://myaccount.google.com/permissions\" target=\"_blank\" rel=\"noopener noreferrer\">Google Account permissions page</a>.",
          "<strong class=\"text-bone-50\">Updates:</strong> the app checks GitHub for new versions. Firebase Cloud Messaging registers an app/device token and subscribes to update and announcement topics, including before you sign in. Google processes the token to deliver notifications."
        ]
      }
    ]
  },
  {
    "heading": "6. Device Permissions",
    "parts": [
      {
        "ul": [
          "<strong class=\"text-bone-50\">Internet:</strong> to stream music and fetch lyrics.",
          "<strong class=\"text-bone-50\">Background playback</strong> (foreground service, wake lock): to keep music playing with the screen off.",
          "<strong class=\"text-bone-50\">Notifications:</strong> for playback controls, download progress and update notices.",
          "<strong class=\"text-bone-50\">Microphone:</strong> when you use song recognition or voice search.",
          "<strong class=\"text-bone-50\">Install apps:</strong> only to install an update you choose to download in the app.",
          "<strong class=\"text-bone-50\">Run after restart:</strong> used by Android's background-task system to resume scheduled work after your phone restarts."
        ]
      }
    ]
  },
  {
    "heading": "7. Ads, Analytics and Service Data",
    "parts": [
      "Auralis contains no advertising, analytics or crash-reporting SDK. Firebase, Discord and other external services process the information needed for the features described above under their own policies. This is why we do not describe all network activity as zero telemetry."
    ]
  },
  {
    "heading": "8. Deleting Your Data",
    "parts": [
      "Account backups remain in Firebase until you delete the account or request deletion. Rooms that are not closed properly may remain until a maintainer removes them.",
      {
        "ul": [
          "<strong class=\"text-bone-50\">On your phone:</strong> clear your song cache and downloads in Settings › Storage, or remove everything by clearing the app's data or uninstalling it.",
          "<strong class=\"text-bone-50\">Listening stats:</strong> \"Clear stats\" in the Stats screen deletes your stats from your phone and, if you're signed in, from your account.",
          "<strong class=\"text-bone-50\">Your account and backed-up library:</strong> signing out does not delete data stored in Firebase. In Auralis 1.1.1 and later, tap <strong class=\"text-bone-50\">Delete account</strong> in your Profile to permanently delete your account and everything backed up to it: playlists, liked songs, saved artists and listening stats. You'll confirm it's you first.",
          "<strong class=\"text-bone-50\">On older versions:</strong> email <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"mailto:auralis018@gmail.com\">auralis018@gmail.com</a> to request deletion. We will arrange a private way to verify the request."
        ]
      }
    ]
  },
  {
    "heading": "9. Children's Privacy",
    "parts": [
      "Auralis is not directed at children under 13, and we do not knowingly collect personal information from children."
    ]
  },
  {
    "heading": "10. Open Source",
    "parts": [
      "All of Auralis's own code is open source under the GPL-3.0 license and can be read on our <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://github.com/Shreyanshh071/Auralis\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub repository</a>. The Firebase and Discord SDKs mentioned above are closed source."
    ]
  },
  {
    "heading": "11. Changes to This Policy",
    "parts": [
      "If this policy changes, we'll update the date at the top and mention significant changes in the release notes."
    ]
  },
  {
    "heading": "12. Contact",
    "parts": [
      "For privacy questions, access or deletion requests, email the Auralis maintainers at <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"mailto:auralis018@gmail.com\">auralis018@gmail.com</a>. You can also open a general issue on our <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://github.com/Shreyanshh071/Auralis/issues\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub Issues page</a>, but do not post account details or other personal data there."
    ]
  }
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    "heading": "1. Using Auralis",
    "parts": [
      "Auralis is a free, open-source music player for Android, distributed under the GNU General Public License v3.0 (GPL-3.0). By using the app or this website, you agree to these terms."
    ]
  },
  {
    "heading": "2. Content and Your Responsibility",
    "parts": [
      "Auralis does not host, upload or own any music, videos or lyrics. It streams music from YouTube Music and fetches lyrics and song information from third-party services. All content belongs to its respective rights holders.",
      "Use of Auralis does not grant rights to third-party content. YouTube's terms restrict downloading content without authorization, and <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://developers.google.com/youtube/terms/developer-policies\" target=\"_blank\" rel=\"noopener noreferrer\">YouTube's API policies</a> restrict audio-only downloads and background playback. Review the applicable service terms before using those features; availability of a feature in Auralis does not mean a service has authorized it."
    ]
  },
  {
    "heading": "3. Third-Party Services",
    "parts": [
      "Features that rely on outside services, such as YouTube, Google Firebase, Discord, Spotify, Shazam, lyrics services and AI translation providers, are subject to those services' own terms, including the <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://www.youtube.com/t/terms\" target=\"_blank\" rel=\"noopener noreferrer\">YouTube Terms of Service</a>. These services can change or stop working at any time, and Auralis features that depend on them may stop working too."
    ]
  },
  {
    "heading": "4. Accounts and Listen Together",
    "parts": [
      "Signing in is optional. You're responsible for keeping your sign-in details safe. When you use Listen Together, don't share unlawful content or harass other people in a room."
    ]
  },
  {
    "heading": "5. No Warranty",
    "parts": [
      "Auralis is provided \"as is\", without warranty of any kind, express or implied, to the maximum extent permitted by applicable law, as stated in the GNU General Public License v3.0."
    ]
  },
  {
    "heading": "6. Limitation of Liability",
    "parts": [
      "To the extent permitted by law, the authors and contributors are not liable for any claim, damages or other liability arising from your use of Auralis, including loss of data or problems caused by third-party services."
    ]
  },
  {
    "heading": "7. Open Source License",
    "parts": [
      "You're free to run, study, share and modify Auralis under the terms of the GPL-3.0 license. The source code is on our <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://github.com/Shreyanshh071/Auralis\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub repository</a>. The Firebase and Discord SDKs included in the app are closed source and covered by their own licenses."
    ]
  },
  {
    "heading": "8. Trademarks",
    "parts": [
      "Auralis is an independent project and is not affiliated with, sponsored by or endorsed by Google, YouTube, Spotify, Discord, Apple or Shazam. All trademarks belong to their respective owners."
    ]
  },
  {
    "heading": "9. Changes to These Terms",
    "parts": [
      "We may update these terms. When we do, we'll change the date at the top. Continuing to use Auralis after a change means you accept the updated terms."
    ]
  },
  {
    "heading": "10. Contact",
    "parts": [
      "For questions about these terms, email <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"mailto:auralis018@gmail.com\">auralis018@gmail.com</a> or open a general issue on our <a class=\"text-bone-50 underline underline-offset-4 hover:text-white\" href=\"https://github.com/Shreyanshh071/Auralis/issues\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub Issues page</a>. Do not post personal details in public issues."
    ]
  }
];
