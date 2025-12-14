# Critique.

## About the Project

The website that judges you based on your media interests. Choose your social media platform, select a tone (roast if you're up to it), and let Critique give you a complete review of your activities on the platform. The users can get critiques on their Spotify, MyAnimeList, Github, and Letterboxd profiles with other platform integrations on the way!

<p align="center" width="100%">
    <video width="90%" alt="Demo Video" src="https://github.com/user-attachments/assets/a82c6ece-af8a-416b-952b-df62f409a38b" controls />
</p>


## Technologies Used

- Next.js
- Typescript
- Tailwind CSS
- Openrouter
- API for developers (Spotify, MyAnimeList, Github)

## Getting Started

To start Critique locally, use these following steps:

### Clone the repository

```
git clone https://github.com/Spandan-Mishra/critique.git

cd critique
```

### Installation

```
npm install
```

### Configuration

Create `.env` by using:

```
cp .env.example .env
```

Add values to the following environment variables:

```
OPENROUTER_API_KEY=
MAL_CLIENT_ID=
GITHUB_TOKEN=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://127.0.0.1:5000 (default for local development)
```

### Starting the project

Go to the root and run this command

```
npm run dev
```