import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { IngredientModule } from './ingredient/ingredient.module';
import { IngredientCategoryModule } from './ingredient-category/ingredient-category.module';
import { IngredientUnitModule } from './ingredient-unit/ingredient-unit.module';
import { StockInModule } from './stock-in/stock-in.module';
import { StockOutModule } from './stock-out/stock-out.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 600000,
        limit: 30,
      },
    ]),
    PrismaModule,
    UserModule,
    AuthModule,
    IngredientModule,
    IngredientCategoryModule,
    IngredientUnitModule,
    StockInModule,
    StockOutModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
