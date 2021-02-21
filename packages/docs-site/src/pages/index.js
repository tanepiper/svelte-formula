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
    imageUrl: 'img/undraw_form.svg',
    description: (
      <>
        Formula works out-of-the-box with HTML5 forms and validation without the need for any JavaScript configuration.
      </>
    ),
  },
  {
    title: <>Fully Reactive</>,
    imageUrl: 'img/undraw_apps.svg',
    description: (
      <>
        Build powerful reactive data-driven applications with custom validation, enrichment and messages, and work with
        grouped data.
      </>
    ),
  },
  {
    title: <>Built for Svelte</>,
    imageUrl: 'img/svelte-logo.svg',
    description: (
      <>Easy to install Action and Subscriptions that just work with your application without getting in the way.</>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
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
