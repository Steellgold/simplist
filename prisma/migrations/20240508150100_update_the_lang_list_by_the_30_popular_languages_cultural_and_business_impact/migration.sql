/*
  Warnings:

  - The values [AB,AA,AF,AK,SQ,AM,AN,HY,AS,AV,AE,AY,AZ,BM,BA,EU,BE,BH,BI,BS,BR,BG,MY,CA,KM,CH,CE,NY,CU,CV,KW,CO,CR,HR,CS,DA,DV,DZ,EO,ET,EE,FO,FJ,FI,FF,GD,GL,LG,KA,KI,EL,KL,GN,HT,HA,HE,HZ,HO,HU,IS,IO,IG,IA,IE,IU,IK,GA,JV,KR,KS,KK,RW,KV,KG,KJ,KU,KY,LO,LA,LV,LB,LI,LN,LT,LU,MK,MG,MS,ML,MT,GV,MI,MH,MN,NA,NV,ND,NG,NE,SE,NO,NB,NN,II,OC,OJ,OR,OM,OS,PI,PS,QU,RM,RN,SM,SG,SA,SC,SR,SN,SD,SI,SK,SL,SO,ST,NR,SU,SS,TL,TY,TG,TT,BO,TI,TO,TS,TN,TK,TW,UG,UK,UZ,VE,VO,WA,CY,FY,WO,XH,YI,YO,ZA,ZU] on the enum `Lang` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Lang_new" AS ENUM ('EN', 'ZH', 'HI', 'ES', 'FR', 'AR', 'BN', 'RU', 'PT', 'ID', 'UR', 'DE', 'JA', 'SW', 'MR', 'TE', 'TR', 'TA', 'FA', 'IT', 'TH', 'GU', 'KN', 'KO', 'PL', 'PA', 'VI', 'NL', 'SV', 'RO');
ALTER TABLE "Variant" ALTER COLUMN "lang" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "lang" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "lang" TYPE "Lang_new" USING ("lang"::text::"Lang_new");
ALTER TABLE "Variant" ALTER COLUMN "lang" TYPE "Lang_new" USING ("lang"::text::"Lang_new");
ALTER TYPE "Lang" RENAME TO "Lang_old";
ALTER TYPE "Lang_new" RENAME TO "Lang";
DROP TYPE "Lang_old";
ALTER TABLE "Variant" ALTER COLUMN "lang" SET DEFAULT 'FR';
ALTER TABLE "Post" ALTER COLUMN "lang" SET DEFAULT 'EN';
COMMIT;
