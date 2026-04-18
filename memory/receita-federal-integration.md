# Receita Federal Integration Plans

> Research date: 2026-04-15

## Key Finding
Receita Federal does NOT offer public REST APIs for DCTFWeb or e-CAC. Integration is file-based or through desktop programs.

---

## DCTFWeb Integration

### Official Methods
- **JSON Import** (Layout 1.0) - Machine-to-machine file submission
- **Receitanet** - Desktop program for transmission
- **e-CAC Portal** - Manual web submission

### Authentication
- gov.br account (Silver or Gold level required)
- Digital Certificate (A1 or A3) registered in gov.br
- CNPJ of represented taxpayer
- Procuração (power of attorney) for third-party representation

### Data Formats
- Input: JSON following MIT (Manual de Orientação) schema v1.0
- Output: XML with official XSD schemas

### Files
- Layout: `MIT - Leiaute 1.0 do Arquivo JSON de Importação`
- Schema: `MIT - Esquema 1.0 do Arquivo JSON de Importação`
- Updated: February 2025

---

## e-CAC Integration

### Current Status
- No official API available
- Web portal only for mailbox/messages
- Alert component (`EcacAlertBanner`) needs real data source

### Alternative Approaches

#### Option 1: Third-party Services (RECOMMENDED FOR PRODUCTION)
- senior.com.br
- automacaofiscal.com.br
- Provides pre-built API access

#### Option 2: File-based Processing
- Use official PGD/Receitanet tools
- Manual import/export workflow

#### Option 3: Web Scraping (NOT OFFICIALLY SUPPORTED)
- Headless browser automation
- Not endorsed by government

---

## Related Application Files

### Database Schema
- `prisma/schema.prisma` - Contains `Obrigacao`, `Mensagem`, `Cliente` models

### UI Components
- `src/routes/dashboard/obrigacoes/+page.svelte` - Obligations page
- `src/routes/dashboard/obrigacoes/dctfweb/+page.svelte` - DCTFWeb specific page
- `src/routes/dashboard/caixa-postal/+page.svelte` - e-CAC mailbox
- `src/lib/components/dashboard/EcacAlertBanner.svelte` - Alert component

---

## eSocial (Related)

- XML-based with XSD schemas
- Test environment: Produção Restrita
- Requires Gold or Silver gov.br level (mandatory since June 2023)

---

## Next Steps (When Ready)

1. Choose integration approach (third-party vs manual)
2. Implement certificate management
3. Set up gov.br authentication flow
4. Build JSON import pipeline for DCTFWeb
5. Connect e-CAC message fetching (or use third-party)

---

## References
- e-CAC Portal: https://www.gov.br/receitafederal/pt-br/servicos
- eSocial: http://www.esocial.gov.br
- DCTFWeb Documentation: Updated January 2025
- Legal: Instrução Normativa RFB nº 2.237/2024