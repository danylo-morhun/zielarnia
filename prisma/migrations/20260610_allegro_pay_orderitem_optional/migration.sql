-- Add ALLEGRO_PAY to PaymentMethod enum
ALTER TYPE "PaymentMethod" ADD VALUE 'ALLEGRO_PAY';

-- Make OrderItem.variantId optional (nullable FK for marketplace orders)
ALTER TABLE "OrderItem" ALTER COLUMN "variantId" DROP NOT NULL;
