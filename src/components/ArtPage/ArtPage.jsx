import React, { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { GoArrowRight } from 'react-icons/go';
import PortfolioNav from '../PortfolioNav';
import './ArtPage.css';

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const poems = [
  {
    title: 'Our Garden Rose',
    image: '/poem-images/our-garden-rose.png',
    imageTone: 'muted red on black paper',
    stanzas: [
      `Among the rest of them, one
stands out: the rose.
Our garden, petite and delicate, now
has a rose, so red, so inviting, so fresh
that it bleeds fragrance, sheds
liver-red petals, and is whispering,
"come forth, and lick me into poetry."`,
    ],
  },
  {
    title: 'Yellow Soccer Ball',
    image: '/poem-images/yellow-soccer-ball.png',
    imageTone: 'dull yellow scuff on concrete',
    stanzas: [
      `My yellow soccer ball
dad brings it home, and
I have not blinked once;
A piece of the sun before me
Glorious, tough, loyal, how much
I adore it! So yellow, I want to eat it,
bite into its flesh like a
hungry fox.`,
      `A day passed, and my yellow soccer ball
tore open, what
a short life it had, little did
I know, the yellow was telling me goodbye from
the start.`,
    ],
  },
  {
    title: 'Guilt, Betrayal / The Radioactive Glass',
    image: '/poem-images/radioactive-glass.png',
    imageTone: 'faint green trace on black paper',
    stanzas: [
      `The delicate glass, shiny and
so beautiful, while all I
had to do was to
hold it near and dear to me
It fell, now shattered in
pieces, all broken, never
recoverable in its very
first form. All I
had to do was
to protect it. I failed,
I did not fulfil; and now
I am writing this poem-
little do I know that I...
am uncapable of... even fini-`,
    ],
  },
  {
    title: 'A Smile Behind the Bars',
    image: '/poem-images/smile-behind-bars.png',
    imageTone: 'gold reflection behind vertical shadows',
    stanzas: [
      `You put me in this
golden cage, behind the
golden golden bars`,
      `And if I had the
choice of choosing`,
      `I will pick your
golden golden shackles a
million times over`,
      `If only I was
given the chance
once again, and
break free of
this choking freedom-
If only`,
    ],
  },
  {
    title: 'A Long Lost Hope',
    image: '/poem-images/long-lost-hope.png',
    imageTone: 'folded paper in a strip of light',
    stanzas: [
      `"If I could...", "If I could...", "If I could..."
is haunting me, and
will forever do
But hey! I am okay, and
as it should.`,
    ],
  },
  {
    title: 'O Distant Refuge',
    image: '/poem-images/distant-refuge.png',
    imageTone: 'curtain edge and cold light',
    stanzas: [
      `refuge, O source of my hope
how are you?
O glow of moonlight, O feather
of a heart
how are you?
O so beautiful soul, O innocent
hands, O owner of the pearls, O breeze
of joy
how are you?
O graceful, O pure, O glamorous`,
      `O beautiful blue eyes`,
      `How are you?`,
    ],
  },
  {
    title: 'Fading, Memory by Memory',
    image: '/poem-images/fading-memory-ballet.png',
    imageTone: 'ballet ribbon on a black floor',
    stanzas: [
      `Walking next to you
not holding hands
you are disappointed at me
The sky is clear, with a soft breeze
taking over our shoulders
Why were you still there?
There, right then, right that second
and you disappeared, nobody was next
to me from the beginning of that night, or
at least, not the same body,
not the same person and now
who are you? who is this?
I am afraid, full of fear
As if you are a memory
falling off a cliff
and with my hand stretched
I'm holding on to you, while
you, with tears in your eyes
and a soft crying voice, say
"Don't forget me."`,
    ],
  },
  {
    title: 'One Last Look',
    image: '/poem-images/one-last-look.png',
    imageTone: 'black airplane window and distant lights',
    stanzas: [
      `at the lights of San Francisco
from the plane window
and a flash
of all the moments
where I thought life
cannot get any happier
than this`,
      `One last look and
we were now far
far away, the plane
flying so aggressively, the
wooshing sound, this damned
deafening sound`,
      `I am far, my ears
locked and nothing
but darkness visible for
miles`,
      `And now you
are all of this city
everywhere, at every two
hands holding, at every
kiss, at every heart, at
every work of art, at every
love, is all you and all
of you`,
      `Then the landing, I jump
out of my sleep, I sigh
and prepare once
again to walk
onto my journey that
is all of this.`,
    ],
  },
  {
    title: 'Year is Checkered',
    image: '/poem-images/year-is-checkered.png',
    imageTone: 'checkered cloth under a hard shadow',
    stanzas: [
      `When we were overwhelmed
with happiness, frolicing along
the Columbus street
all I saw was light, even
at the midnight when we
craved ice cream
The soft breeze of summer
playing with your skirt, and my
hand locked with yours`,
      `At that moment, all I could see
was light`,
      `But then, winter arrived, and
my hand now was piercing
through your skin, a set
of invisible claws that were
dipped in the poison
of betrayal
going deeper and deeper into your essence of honesty and trust and love and care and loyalty
but my words, those cold, shiny, thin blades were why you never saw
the horns, the claws, the hell in my eyes.`,
      `A winter, gloomy
and harsh, that is who
I was to your delicate soul.`,
      `Your year got checkered,
and I am sawing my horns,
cutting my claws,
wanting to
one day, kill this winter of a monster,
and maybe, again, reach the light!`,
    ],
  },
  {
    title: 'A Long Last Blue Poem',
    image: '/poem-images/long-last-blue-poem.png',
    imageTone: 'one blue thread on black paper',
    stanzas: [
      `where each stanza talks
of you, for you, and only you.
How are you?
Why are you
here, to read a long blue poem?
why should you, even?`,
      `How are your eyes, your face,
your hands, your legs, your heart?
Do they feel craved-for, longed-for, yet?`,
      `How about your words, your love, your thoughts
do they?`,
      `When your ear-to-ear beam of joy
was such a bless to see, to
your scent not to wear off my sheets`,
      `and your feeble self that
never plotted nor schemed
and you who named a hater "an asshole"`,
      `how funny of a language-
where what comes after the alphabet's cursed letter "h"
would never be found
along a blue poem`,
      `Lana's vocals echo
back from the corners of
a small room located east
of Yerba Buena`,
      `Went back
to your baby photo
The colorful ball before your foot
your hat so large, so gangster
Your floral red dress that
has blue flowers too
you are that same creature
but now hurt, or not, for who
has that power over you
You hold the sheer power, so beyond thought, beyond
human`,
      `You are caressed
by the hands of Venus
and made of dust
from the gorgeous moon-
look at you
the blue sky's glow
reflects from your eyes
the glow on darkness
marked all over the art
on one glamorous canvas:
your body`,
      `You deserve a lord
of Ephyra, but one eternally
blessed to kneel
before you and cry
scream, bleed, and hug
the sweet shackles, only
grateful of your presence`,
      `Soon, you may see less
of Stefan
who betrayed you
He shall be gone
and for all that he has done for self,
for once, he may do one
for you:
to be gone
and never make
your eyes of much beauty
see such creature of no
value, essence, nor soul`,
      `Those last words of yours
are a lullaby and a wake up call.
Thoughts of you are hugs of
calm, the dark
blue scarf
wrapped around my neck
presents me the joy to
yearn, for such a thorn to be
cursed to yearn and never can
love, or at least, so to be told`,
      `Remember:
not one Marlboro shall be
held by my hands
unless
you are there,
and not one love
shall be felt that does not
carry your breeze-
you see the moon, please
wave and say hello
back, for a hello was sent
to you from far far away
or why
should you, but hey,
who knows one who
has no hope.
At the absence of your words,
that hope, the only and last one, keeps me company`,
      `And here, at last`,
      `Peace, Love
so long, blue eyes!`,
    ],
  },
];

const PoemBlock = ({ poem, index }) => (
  <article className="poem-block" id={slugify(poem.title)}>
    <figure className="poem-image-frame">
      <img src={poem.image} alt={`${poem.title} companion image`} loading={index > 1 ? 'lazy' : 'eager'} />
    </figure>
    <div className="poem-copy">
      <p className="poem-index">{String(index + 1).padStart(2, '0')}</p>
      <h2>{poem.title}</h2>
      <div className="poem-stanzas">
        {poem.stanzas.map((stanza, stanzaIndex) => (
          <p key={stanzaIndex}>
            {stanza.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < stanza.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    </div>
  </article>
);

const ArtPage = () => {
  const location = useLocation();
  const pathParts = location.pathname.replace(/^\/art\/?/, '').split('/').filter(Boolean);
  const activeSection = pathParts[0] || null;
  const slug = pathParts[1] || null;

  useEffect(() => {
    if (!slug) return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [slug]);

  if (activeSection && activeSection !== 'poems') {
    return <Navigate to="/art/poems" replace />;
  }

  if (!activeSection) {
    return <Navigate to="/art/poems" replace />;
  }

  return (
    <main className="poems-page">
      <PortfolioNav />

      <section className="poems-hero" aria-labelledby="poems-title">
        <p className="poems-kicker">Poems</p>
        <h1 id="poems-title">Private weather</h1>
        <p>
          Poems for distance, attachment, regret, and the small objects that stay after a
          feeling has moved on.
        </p>
      </section>

      <section className="poems-index" aria-label="Poem index">
        {poems.map((poem, index) => (
          <a href={`#${slugify(poem.title)}`} key={poem.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {poem.title}
          </a>
        ))}
      </section>

      <section className="poem-list" aria-label="Poems">
        {poems.map((poem, index) => (
          <PoemBlock poem={poem} index={index} key={poem.title} />
        ))}
      </section>

      <footer className="poems-footer">
        <Link to="/">
          Index
          <GoArrowRight aria-hidden="true" />
        </Link>
      </footer>
    </main>
  );
};

export default ArtPage;
