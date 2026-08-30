import { Song, Ministration, TeamMember } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: 1,
    title: "Satisfy",
    artist: "Joe Mettle",
    category: "Worship",
    key: "G",
    originalKey: "G",
    tempo: "Slow (68 BPM)",
    bpm: 68,
    timeSignature: "4/4",
    icon: "🎵",
    audioUrl: "",
    lyrics: `[Verse 1]
Only You can satisfy my soul
Only You can make me whole
In Your presence is fullness of joy
At Your right hand are pleasures forevermore

[Chorus]
Satisfy my longing heart, Lord
Fill me till I want no more
Holy Spirit, have Your way
Pour Your oil afresh today

[Bridge]
Draw me closer, closer to Your throne
Where Your glory and Your power are shown
Let Your living water overflow
Only You can satisfy`,
    chords: `[Intro] | G | C/G | Em7 | Dsus4 D |
[Verse] G - C/E - G/B - D - Em7 - C - Dsus4 - G
[Chorus] C - D/C - Bm7 - Em7 - Am7 - Dsus4 - G
[Bridge] Em7 - D/F# - G - C - Am7 - G/B - Dsus4 - G`,
    arrangement: {
      lead: "Lead vocal opens very tenderly. Establish phrasing with deep emotion before the backing vocal entrance.",
      soprano: "Enters on Chorus 1 in upper thirds (D5 down to B4). Maintain breath control on the sustained 'Satisfy'.",
      alto: "Locks into the fundamental third below soprano on Chorus. Support the middle register on Bridge crescendo.",
      tenor: "Rich foundation harmony (G3 to B3). Add counter-vocal line on the final chorus repeat."
    },
    instruments: {
      keyboard: "Warm grand piano with lush ambient pad layer (Reverb 4.2s). Keep left hand subtle until Bridge.",
      guitar: "Acoustic fingerpicking on verses; add smooth overdrive volume swells on the choruses.",
      bass: "Smooth root note pads. Join fully on Verse 2 with melodic walking fills into Chorus.",
      drums: "Rim click and gentle swell cymbals on Verse 1; build to deep kick and warm snare in Bridge.",
      brass: "Gentle French horn and string pad emulation during final chorus climax."
    },
    mdNotes: `• Begin with 4-bar piano intro in G major.
• Allow the lead vocalist to freely express the first stanza before tempo locks in.
• Band builds dynamically by 30% on the Bridge repeat.
• Modulation to Ab major on the 3rd chorus if the spirit leads.
• Soft acoustic piano outro tapering into prayer moment.`,
    duration: "6:45",
    tags: ["Worship", "Intimacy", "Holy Spirit"]
  },
  {
    id: 2,
    title: "Ogya Fire",
    artist: "Carl Clottey / Empraise Inc.",
    category: "Praise",
    key: "F",
    originalKey: "F",
    tempo: "Fast (124 BPM)",
    bpm: 124,
    timeSignature: "4/4",
    icon: "🔥",
    audioUrl: "",
    lyrics: `[Intro Call & Response]
Ogya! (Ogya!)
Ogya bɛhyew yɛn so (Fire fall upon us)
Holy Ghost fire, burn within!

[Verse]
When the Holy Ghost moves, mountains tremble
When His fire comes down, chains are broken
Let Your fire fall, let Your power reign
Consume every weight, take all the glory!

[Chorus]
Ogya ee, Holy Ghost fire
Ogya ee, let it burn in me
Purify my heart, set my soul ablaze
We will testify of Your mighty grace!`,
    chords: `[Intro Groove] | F7 | Bb7 | C7 | F7 |
[Verse] F - Bb - C - Dm - Bb - C - F
[Chorus] F - Bb/F - C/E - Dm - Gm7 - C7 - F`,
    arrangement: {
      lead: "High energy, commanding presence. Drive the rhythmic call-and-response chants.",
      soprano: "Bright, punchy upper vocal harmonies with sharp rhythmic accents on 'Ogya!'",
      alto: "Solid middle brass-style vocal stabs supporting the bounce.",
      tenor: "Powerful low-mid vocal punch driving the syncopated responses."
    },
    instruments: {
      keyboard: "Bright bright DX7 / CP80 electric piano with fast syncopated Ghanaian praise comping.",
      guitar: "Highlife / Afro-gospel rhythmic muted skanks on 2 and 4.",
      bass: "Energetic walking and slapping gospel bass line. Keep low end tight with the kick drum.",
      drums: "Full driving praise groove with ghost notes on snare and solid four-on-the-floor hi-hat accents.",
      brass: "Live brass stabs answering the vocal punchlines."
    },
    mdNotes: `• Start with high energy drum roll into brass fanfare.
• Keep transitions tight with crisp cut-offs on beat 4.
• Watch the tempo—do not rush the Afro-gospel pocket.
• Rehearse the double-time section at the vamp.`,
    duration: "5:30",
    tags: ["Praise", "Holy Ghost", "High Energy"]
  },
  {
    id: 3,
    title: "Afropraise Medley",
    artist: "Siisi Baidoo",
    category: "Afropraise",
    key: "C",
    originalKey: "C",
    tempo: "Fast (130 BPM)",
    bpm: 130,
    timeSignature: "4/4",
    icon: "🌍",
    audioUrl: "",
    lyrics: `[Part 1 - Onyame Ye]
Onyame yɛ, Onyame yɛ (God is good)
Ne dɔ yɛ kɛse (His love is great)
Every day and everywhere
I will lift His holy name!

[Part 2 - Hallelujah Celebration]
Hallelujah, Jehovah reigns!
He has given me victory
No weapon formed against me shall prosper
I am more than a conqueror!

[Part 3 - Praise Jump & Shout]
Everybody praise the Lord now!
Jump for Jesus, shout for joy!`,
    chords: `[Part 1] | C | F | G | C |
[Part 2] C - Am - F - G - C
[Part 3] C - G/B - Am - F - G - C`,
    arrangement: {
      lead: "Transitions the team smoothly between language sections and leads joyous dance cues.",
      soprano: "Melodic joyful African harmonies, bright resonance on high G5 notes.",
      alto: "Harmonic anchor across all 3 medley songs with steady rhythmic presence.",
      tenor: "Deep rhythmic vocal foundation with rich harmonic resonance."
    },
    instruments: {
      keyboard: "Ghanaian highlife piano rolls and rhythmic organ comping.",
      guitar: "Twin electric guitar interplay—one lead picking, one highlife rhythm.",
      bass: "Fast, groovy Ghanaian praise bass lines with syncopated root-octave jumps.",
      drums: "Full Afro-gospel groove incorporating traditional bell pattern on ride cymbal."
    },
    mdNotes: `• Medley seamlessly links 3 classic praises without stopping the beat.
• Drummer gives 2-bar cue before switching rhythm feels.
• Direct the band for the 8-bar praise break where choir dances.`,
    duration: "8:15",
    tags: ["Afropraise", "Medley", "Celebration"]
  },
  {
    id: 4,
    title: "Wo Ne Nyame",
    artist: "Gospel Collection",
    category: "Gospel",
    key: "Bb",
    originalKey: "Bb",
    tempo: "Medium (82 BPM)",
    bpm: 82,
    timeSignature: "4/4",
    icon: "🎤",
    audioUrl: "",
    lyrics: `[Verse]
Wo ne Nyame a woyɛ kɛse (You are the great God)
Obiara nte sɛ Wo (None is like You)
From age to age You remain the same
Your kingdom shall never end

[Chorus]
Wo ne me guankɔbea (You are my refuge)
Wo ne me gyefo (You are my deliverer)
I give You all my worship
Today and forevermore`,
    chords: `[Verse] Bb - F/A - Gm7 - Eb - Bb/D - Cm7 - F
[Chorus] Eb - F/Eb - Dm7 - Gm7 - Cm7 - Fsus4 - Bb`,
    arrangement: {
      lead: "Expressive, soul-stirring vocal delivery with space for the backing choir to blossom.",
      soprano: "Sweet, floating soprano lines on the second chorus.",
      alto: "Warm counterpoint on the chorus refrain.",
      tenor: "Full, warm resonance underpinning the vocal choir chords."
    },
    instruments: {
      keyboard: "Classic Rhodes / Grand piano combination with rich 9th and 11th gospel voicings.",
      guitar: "Clean electric guitar with stereo chorus and analog delay.",
      bass: "Smooth, melodic bass passing tones connecting chord inversions.",
      drums: "Deep, punchy 70s-style gospel drum groove with crisp snare."
    },
    mdNotes: `• Keep the verses delicate and spacious.
• Big gospel swell into the Chorus with organ glissando.
• Extended vamp on 'Wo ne me gyefo' allowing congregation participation.`,
    duration: "6:00",
    tags: ["Gospel", "Worship", "Twi"]
  },
  {
    id: 5,
    title: "You Are Great",
    artist: "Steve Crown",
    category: "Worship",
    key: "E",
    originalKey: "E",
    tempo: "Slow (66 BPM)",
    bpm: 66,
    timeSignature: "4/4",
    icon: "👑",
    audioUrl: "",
    lyrics: `[Verse]
You are great, yes You are, Holy one
Walked upon the sea, raised the dead
You reign in majesty, mighty God
Everything written about You is great

[Chorus]
You are great, You are great
You are great, You are great
Everything written about You is great`,
    chords: `[Verse] E - B/D# - C#m7 - A - E/G# - F#m7 - Bsus4
[Chorus] E - B/D# - C#m7 - A - B - E`,
    arrangement: {
      lead: "Reverent and majestic opening leading into congregational worship.",
      soprano: "Elevated celestial harmonies in thirds above melody.",
      alto: "Middle harmony sustaining the warmth of the progression.",
      tenor: "Harmonic anchor providing strong vocal weight."
    },
    instruments: {
      keyboard: "Orchestral strings layered with acoustic grand piano.",
      guitar: "Ambient volume swells with reverb and shimmering delay.",
      bass: "Sustained root notes with rich low-end presence.",
      drums: "Mallet cymbal swells and deep floor tom rhythms."
    },
    mdNotes: `• Flow smoothly from prayer into this song.
• Minimum instrumentation at start—let voices carry the reverence.
• Build to full orchestra sound on final chorus.`,
    duration: "5:50",
    tags: ["Worship", "Majesty", "Congregational"]
  },
  {
    id: 6,
    title: "Awesome God",
    artist: "Sinach / Live Praise",
    category: "Contemporary",
    key: "D",
    originalKey: "D",
    tempo: "Medium-Fast (115 BPM)",
    bpm: 115,
    timeSignature: "4/4",
    icon: "⚡",
    audioUrl: "",
    lyrics: `[Verse]
Holy are You Lord, all creation call You God
Worthy is Your name, we lift our hands and praise
From the rising of the sun to the going down of the same
Your name is to be hallowed!

[Chorus]
You are an Awesome God, mighty are Your works
You are an Awesome God, faithful in all Your ways!`,
    chords: `[Verse] D - G - Bm - A - G - A - D
[Chorus] G - A - F#m - Bm - Em - A - D`,
    arrangement: {
      lead: "Powerful dynamic vocal attack.",
      soprano: "Crisp contemporary harmony.",
      alto: "Supporting rich vocal body.",
      tenor: "Punchy harmonic drive."
    },
    instruments: {
      keyboard: "Modern synth pads and synth brass accents.",
      guitar: "Crunch rhythm electric guitar chords.",
      bass: "Punchy modern gospel slap bass.",
      drums: "Solid modern stadium gospel drums."
    },
    mdNotes: `• Tight start on beat 1.
• Drum break before the bridge.
• Big ending on sustained D major chord.`,
    duration: "5:10",
    tags: ["Contemporary", "Praise"]
  }
];

export const INITIAL_MINISTRATIONS: Ministration[] = [
  {
    id: 1,
    name: "BaselFest 2026",
    date: "Saturday, 12th September 2026",
    time: "4:00 PM GMT",
    venue: "Main Worship Auditorium",
    theme: "Sounds of Revival & Glory",
    status: "Upcoming",
    description: "Jewels Music Ministry annual flagship praise and worship ministration for BaselFest celebration.",
    mdGlobalNotes: "All vocalists and band members must arrive 1 hour before sound check (2:30 PM). Dress code is White and Royal Blue. Ensure wireless mics are tested and in-ear monitors paired.",
    songs: [
      {
        songId: 3, // Afropraise Medley
        lead: 1, // Daniel Antwi (MD)
        keyOverride: "C",
        orderNote: "Opening praise explosion. High energy to warm up the congregation.",
        durationMin: 8
      },
      {
        songId: 2, // Ogya Fire
        lead: 2, // Priscilla Mensah
        keyOverride: "F",
        orderNote: "Follows seamlessly from Afropraise. Drum transition without pause.",
        durationMin: 6
      },
      {
        songId: 1, // Satisfy
        lead: 5, // Samuel Appiah
        keyOverride: "G",
        orderNote: "Bring the room down into deep worship and reflection. Soft piano entrance.",
        durationMin: 7
      },
      {
        songId: 4, // Wo Ne Nyame
        lead: 4, // Grace Adomako
        keyOverride: "Bb",
        orderNote: "Congregational climax and prayer transition.",
        durationMin: 6
      }
    ]
  },
  {
    id: 2,
    name: "Sunday Divine Service",
    date: "Sunday, 6th September 2026",
    time: "9:00 AM GMT",
    venue: "Main Sanctuary",
    theme: "Total Surrender & Faith",
    status: "Upcoming",
    description: "Weekly Sunday morning praise and worship service ministration.",
    mdGlobalNotes: "Focus on congregational flow. Keep vocal harmonies clean and balanced.",
    songs: [
      {
        songId: 5, // You Are Great
        lead: 2,
        keyOverride: "E",
        orderNote: "Call to worship",
        durationMin: 6
      },
      {
        songId: 1, // Satisfy
        lead: 3,
        keyOverride: "G",
        orderNote: "Main worship session",
        durationMin: 7
      }
    ]
  },
  {
    id: 3,
    name: "Praise Overflow Night",
    date: "Friday, 15th August 2026",
    time: "7:00 PM GMT",
    venue: "Youth Hall",
    theme: "Unending Praise",
    status: "Completed",
    description: "Special night of non-stop highlife and contemporary gospel praise.",
    mdGlobalNotes: "Great job to the band and vocalists! Tight transitions throughout.",
    songs: [
      {
        songId: 2,
        lead: 2,
        keyOverride: "F",
        durationMin: 6
      },
      {
        songId: 3,
        lead: 1,
        keyOverride: "C",
        durationMin: 8
      },
      {
        songId: 6,
        lead: 5,
        keyOverride: "D",
        durationMin: 5
      }
    ]
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Daniel Antwi",
    role: "Music Director & Lead Admin",
    type: "director",
    voicePart: "Lead / Soloist",
    icon: "🎼",
    phone: "+233 24 123 4567",
    email: "antwidaniel897@gmail.com",
    isAvailable: true,
    canEdit: true
  },
  {
    id: 2,
    name: "Priscilla Mensah",
    role: "Vocal Leader & Soprano",
    type: "vocal",
    voicePart: "Soprano",
    icon: "🎤",
    phone: "+233 50 987 6543",
    email: "priscilla.mensah@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 3,
    name: "Emmanuel Osei",
    role: "Tenor Section Lead",
    type: "vocal",
    voicePart: "Tenor",
    icon: "🎤",
    phone: "+233 27 654 3210",
    email: "emmanuel.osei@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 4,
    name: "Grace Adomako",
    role: "Alto Section Lead",
    type: "vocal",
    voicePart: "Alto",
    icon: "🎤",
    phone: "+233 20 345 6789",
    email: "grace.adomako@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 5,
    name: "Samuel Appiah",
    role: "Tenor / Lead Vocalist",
    type: "vocal",
    voicePart: "Lead / Soloist",
    icon: "🎤",
    phone: "+233 54 876 5432",
    email: "samuel.appiah@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 6,
    name: "Joshua Boateng",
    role: "Main Keyboardist & Synthesizer",
    type: "instrument",
    instrumentType: "Keyboard",
    icon: "🎹",
    phone: "+233 26 112 2334",
    email: "joshua.keys@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 7,
    name: "Derrick Kwakye",
    role: "Lead & Acoustic Guitarist",
    type: "instrument",
    instrumentType: "Guitar",
    icon: "🎸",
    phone: "+233 24 556 6778",
    email: "derrick.guitar@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 8,
    name: "Caleb Arthur",
    role: "Bass Guitarist (5-String)",
    type: "instrument",
    instrumentType: "Bass",
    icon: "🎸",
    phone: "+233 55 998 8776",
    email: "caleb.bass@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 9,
    name: "Michael Tetteh",
    role: "Drummer & Percussionist",
    type: "instrument",
    instrumentType: "Drums",
    icon: "🥁",
    phone: "+233 20 443 3221",
    email: "michael.drums@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  },
  {
    id: 10,
    name: "Benjamin Darko",
    role: "Saxophonist & Horns",
    type: "instrument",
    instrumentType: "Saxophone",
    icon: "🎷",
    phone: "+233 27 887 7665",
    email: "benjamin.sax@jewelsmusic.org",
    isAvailable: true,
    canEdit: false
  }
];
