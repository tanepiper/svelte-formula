import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Zero Configuration</>,
    alt: 'An image of an atom',
    imageUrl: 'img/atom_256.png',
    description: (
      <>
        Native HTML5 forms and validation support without the need for any additional JavaScript configuration, but with
        powerful options to enhance forms.
      </>
    ),
  },
  {
    title: <>Fully Reactive</>,
    alt: 'An image of a chemical reaction',
    imageUrl: 'img/beaker_256.png',
    description: (
      <>
        Build powerful reactive data-driven applications with Formula and data groups with Beaker - enrich with custom
        validation, computed values and custom messages messages.
      </>
    ),
  },
  {
    title: <>Built for Svelte</>,
    alt: 'An image of a molecular structure',
    imageUrl: 'img/molecular-structure_256.png',
    description: (
      <>
        Easy to install Action and Subscriptions that just work with your Svelte application without getting in the way.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description, alt }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={alt} />
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`${siteConfig.title} - ${siteConfig.tagline}`} description={`${siteConfig.tagline}`}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img src={useBaseUrl('/img/logo_256.png')} alt="The Svelte Formula Logo" />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <p>
            <code>npm i svelte-formula</code>
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/formula')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
