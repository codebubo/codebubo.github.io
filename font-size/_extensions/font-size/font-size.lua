function Div(el)
  -- Kontrollera om div har klassen 'font-size-0.8'
  if el.classes:includes('font-size-0.8') then
    -- Lägg till inline CSS för fontstorlek
    el.attributes['style'] = 'font-size: 0.8em;'
    return el
  end
  return el
end
