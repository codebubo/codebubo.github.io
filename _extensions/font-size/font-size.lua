-- font-size.lua
--
-- Ett Lua-filter för Quarto som letar efter Div-element
-- med en klass på formen:
--
--   .fs-80
--   .fs-90
--   .fs-100
--   .fs-120
--
-- I yaml-sektionen: inkludera
--  filters:
--    - font-size
-- Siffran anger fontstorleken i procent av den normala
-- fontstorleken.
--
-- Exempel i en .qmd-fil:
--
--   ::: {.fs-80}
--   Det här är mindre text.
--   :::
--
-- vilket ger en fontstorlek på 0.8em.

-- Funktionen Div() anropas automatiskt av Pandoc/Quarto
-- för varje Div-element som finns i dokumentet.
--
-- "el" (element) innehåller information om den aktuella Div:en,
-- bland annat dess klasser, attribut och innehåll.
function Div(el)
  -- Gå igenom alla klasser som finns på Div-elementet.
  --
  -- Exempel:
  --
  --   ::: {.fs-80 annan-klass}
  --
  -- då innehåller el.classes bland annat:
  --   "fs-80"
  --   "annan-klass"
  for _, class in ipairs(el.classes) do
    -- Försök hitta en klass som börjar med "fs-"
    -- och därefter innehåller en eller flera siffror.
    --
    -- "^fs%-(%d+)$" betyder:
    --
    --   ^       början av texten
    --   fs      bokstäverna "fs"
    --   %-      ett bokstavligt bindestreck
    --   (%d+)   en eller flera siffror
    --   $       slutet av texten
    --
    -- Exempel:
    --
    --   "fs-80"  -> "80"
    --   "fs-120" -> "120"
    --   "stor"   -> ingen träff
    local size = class:match("^fs%-(%d+)$")

    -- Om vi hittade en klass av typen fs-80, fs-120 osv.
    if size then
      -- Gör om siffran från en sträng till ett tal.
      --
      -- "80" -> 80
      local percent = tonumber(size)

      -- Omvandla procent till em.
      --
      -- 80  -> 0.80em
      -- 100 -> 1.00em
      -- 120 -> 1.20em
      local em = percent / 100

      -- Lägg till ett style-attribut på Div-elementet.
      --
      -- Exempel:
      --
      --   style="font-size: 0.80em;"
      --
      -- När Quarto sedan genererar HTML blir resultatet
      -- ungefär:
      --
      --   <div class="fs-80"
      --        style="font-size: 0.80em;">
      --
      el.attributes["style"] = string.format("font-size: %.2fem;", em)

      -- Vi har hittat den klass vi letade efter och
      -- ändrat elementet.
      --
      -- Returnera det modifierade elementet till Pandoc.
      return el
    end
  end

  -- Om Div-elementet inte hade någon klass av typen
  -- fs-XX behöver vi inte göra någonting.
  --
  -- Returnera därför elementet oförändrat.
  return el
end
