# Music App

<img src="public/logo1.svg" alt="logo" width="200"/>

A music streaming website created as a practice project. 
[View demo](https://music-app-umber-phi.vercel.app/)
To avoid infringing on any artists' rights while still serving as an effective proof of concept, this app only features royalty-free music.


## Features
- User authentication
- Browsing songs, artists, albums and playlists
- Music playback with shuffle and repeat
- Editable music queue
- Authenticated users only: saving music by “liking” it, user listening history, playlist creation and sharing.
- Fully responsive mobile-first user interface
- Light/dark mode toggle
- Server-side rendering for faster loading



## Tech Stack

**Client:** React, Next.js, Zustand, SWR, TailwindCSS, shadcn/ui

**Server:** Supabase, React Server Components


##  Database Tables


## Screenshots




## Run Locally


### Database Setup
Prerequisites
- Supabase project and Admin access.
- supabase CLI installed (optional)
- You can run the SQL below in the SQL editor in the Supabase Dashboard or via psql using the DB connection string.

1. create application tables
```sql
-- Profiles: linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY, -- set to auth.users.id
  updated_at timestamptz,
  username text UNIQUE CHECK (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  is_hidden boolean DEFAULT false
);

-- Tracks
CREATE TABLE IF NOT EXISTS public.tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text,
  url text,
  length interval,
  play_count int DEFAULT 0
);

-- Artists
CREATE TABLE IF NOT EXISTS public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text,
  image_url text
);

-- Albums
CREATE TABLE IF NOT EXISTS public.albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  released_at timestamptz,
  title text,
  cover_url text
);

-- Playlists
CREATE TYPE IF NOT EXISTS public."PlaylistStatus" AS ENUM ('PRIVATE','RESTRICTED','PUBLIC');

CREATE TABLE IF NOT EXISTS public.playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  owner_id uuid,
  name text,
  image_url text,
  description text,
  status public."PlaylistStatus" DEFAULT 'RESTRICTED'
);

-- Playlists tracks join
CREATE TABLE IF NOT EXISTS public.playlists_tracks (
  added_at timestamptz DEFAULT now(),
  playlist_id uuid NOT NULL,
  track_id uuid NOT NULL,
  track_album_id uuid,
  added_by uuid,
  PRIMARY KEY (playlist_id, track_id, COALESCE(track_album_id, track_id))
);

-- Playlists shared with users
CREATE TABLE IF NOT EXISTS public.playlists_shared_with_users (
  shared_at timestamptz DEFAULT now(),
  playlist_id uuid NOT NULL,
  shared_with_user_id uuid NOT NULL,
  can_edit boolean DEFAULT false,
  PRIMARY KEY (playlist_id, shared_with_user_id)
);

-- Likes
CREATE TABLE IF NOT EXISTS public.users_liked_tracks (
  liked_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  track_id uuid NOT NULL,
  track_album_id uuid,
  PRIMARY KEY (user_id, track_id, COALESCE(track_album_id, track_id))
);

CREATE TABLE IF NOT EXISTS public.users_history_tracks (
  played_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  track_id uuid NOT NULL,
  track_album_id uuid,
  PRIMARY KEY (user_id, track_id, track_album_id)
);
```
2. create storage buckets
```
# create a private bucket for user uploads
supabase storage bucket create user-uploads --public=false

# create a public bucket for audio files
supabase storage bucket create audio --public=true

# create album covers bucket
supabase storage bucket create covers --public=true
```
3. RLS (Row Level Security Policies)
Enable RLS and add policies so users can only operate on rows they should access

Profiles — allow users to update their own profile; allow public select 
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Allow anyone to read profiles (if you want public visibility)
CREATE POLICY "Profiles public select" ON public.profiles
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Allow authenticated users to update/insert/delete only their own profile
CREATE POLICY "Profiles owner modify" ON public.profiles
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);
```
Playlists — owner can manage; shared users can view or edit depending on can_edit.
```sql
-- Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Owner can select/update/delete
CREATE POLICY "Playlists owner access" ON public.playlists
  FOR ALL
  TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));

-- Shared users can SELECT
CREATE POLICY "Playlists shared users select" ON public.playlists
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists_shared_with_users s
      WHERE s.playlist_id = public.playlists.id
        AND s.shared_with_user_id = (SELECT auth.uid())
    )
    OR owner_id = (SELECT auth.uid())
  );

-- Shared users with can_edit can insert/delete into playlists_tracks
```

Playlists_shared_with_users — only playlist owner can insert/delete sharing rows.
```sql
ALTER TABLE public.playlists_shared_with_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Playlist sharing by owner" ON public.playlists_shared_with_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id
        AND p.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id
        AND p.owner_id = (SELECT auth.uid())
    )
  );
  ```
Playlists_tracks — owners and shared-with users (with can_edit) can manage tracks

```sql
ALTER TABLE public.playlists_tracks ENABLE ROW LEVEL SECURITY;

-- Allow playlist owner to insert/update/delete rows
CREATE POLICY "Playlists_tracks owner modify" ON public.playlists_tracks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.owner_id = (SELECT auth.uid())
    )
  );

-- Allow shared users with can_edit to insert/delete
CREATE POLICY "Playlists_tracks shared modify" ON public.playlists_tracks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists_shared_with_users s
      WHERE s.playlist_id = playlist_id
        AND s.shared_with_user_id = (SELECT auth.uid())
        AND s.can_edit = true
    )
    OR EXISTS (
      SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists_shared_with_users s
      WHERE s.playlist_id = playlist_id
        AND s.shared_with_user_id = (SELECT auth.uid())
        AND s.can_edit = true
    )
    OR EXISTS (
      SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.owner_id = (SELECT auth.uid())
    )
  );
  ```
  Storage.objects — allow users to manage objects inside their folder for a private user bucket.
Assumes per-user folder structure: "<user_id>/...". Replace 'user-uploads' with your real bucket id.

```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT their own files in user-uploads
CREATE POLICY "User objects select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'user-uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Allow users to INSERT only into their own folder in user-uploads
CREATE POLICY "User objects insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Allow users to DELETE their own objects
CREATE POLICY "User objects delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Allow users to UPDATE limited metadata only in their folder
CREATE POLICY "User objects update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
  ```


### Clone the project

```bash
  git clone https://github.com/Daniel12346/music-app.git
```


Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

To run this project, you will need to add the following environment variables to your .env file
`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_ANON_KEY`
