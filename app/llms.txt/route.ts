export function GET() {
  const content = `# Axtar.az
> Azərbaycanda elan, biznes və bloq platforması.

## Əsas bölmələr
- Ana səhifə: https://axtar.az/
- Elan axtarışı: https://axtar.az/full-search
- Bizneslər: https://axtar.az/ownerships
- Bloqlar: https://axtar.az/posts

## Dil və mövzu
- Əsas dil: Azərbaycan dili (az)
- Mövzular: elanlar, məhsullar, xidmətlər, daşınmaz əmlak, bizneslər və alış-veriş.

## Qeyd
Elan məlumatları istifadəçilər və biznes profilləri tərəfindən təqdim olunur. Elanların doğruluğu və satıcı ilə alıcı arasındakı razılaşmalar barədə məlumatı müvafiq səhifədə yoxlayın.
`;
  return new Response(content, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
