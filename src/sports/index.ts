import { sportRegistry } from '../core/registry';
import { footballModule } from './football/module';
import { futsalModule } from './futsal/module';
import { volleyballModule } from './volleyball/module';
import { badmintonModule } from './badminton/module';
import { esportModule } from './esport/module';

// Register all available sport modules
sportRegistry.register(footballModule);
sportRegistry.register(futsalModule);
sportRegistry.register(volleyballModule);
sportRegistry.register(badmintonModule);
sportRegistry.register(esportModule);

export { footballModule, futsalModule, volleyballModule, badmintonModule, esportModule, sportRegistry };
