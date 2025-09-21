/*
  # Tabela produktów na liście zakupów

  1. Nowe tabele
    - `shopping_items`
      - `id` (uuid, klucz główny)
      - `user_id` (uuid, referencja do auth.users)
      - `name` (text, nazwa produktu)
      - `purchase_link` (text, opcjonalny link do zakupu)
      - `image_url` (text, opcjonalny link do zdjęcia)
      - `completed` (boolean, czy produkt został kupiony)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Bezpieczeństwo
    - Włączenie RLS na tabeli `shopping_items`
    - Polityka dla uwierzytelnionych użytkowników do zarządzania swoimi danymi
*/

CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  purchase_link text,
  image_url text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own shopping items"
  ON shopping_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indeks dla lepszej wydajności zapytań
CREATE INDEX IF NOT EXISTS shopping_items_user_id_idx ON shopping_items(user_id);
CREATE INDEX IF NOT EXISTS shopping_items_created_at_idx ON shopping_items(created_at DESC);