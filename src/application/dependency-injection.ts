import { ChromeStorageRepository } from '../infrastructure/repositories/chrome-storage-repository.js';
import { OpenAIApiRepository } from '../infrastructure/repositories/openai-api-repository.js';
import { ProcessTextPromptUseCase } from '../domain/use-cases/process-text-prompt.js';
import { ManageApiConfigUseCase } from '../domain/use-cases/manage-api-config.js';
import { PromptController } from './controllers/prompt-controller.js';
import { ConfigController } from './controllers/config-controller.js';

export class DependencyContainer {
  private static instance: DependencyContainer;
  
  private chromeStorageRepository: ChromeStorageRepository;
  private openAIApiRepository: OpenAIApiRepository;
  private processTextPromptUseCase: ProcessTextPromptUseCase;
  private manageApiConfigUseCase: ManageApiConfigUseCase;
  private promptController: PromptController;
  private configController: ConfigController;

  private constructor() {
    // Infrastructure layer
    this.chromeStorageRepository = new ChromeStorageRepository();
    this.openAIApiRepository = new OpenAIApiRepository();

    // Domain layer (Use Cases)
    this.processTextPromptUseCase = new ProcessTextPromptUseCase(
      this.openAIApiRepository,
      this.chromeStorageRepository
    );
    
    this.manageApiConfigUseCase = new ManageApiConfigUseCase(
      this.chromeStorageRepository,
      this.openAIApiRepository
    );

    // Application layer (Controllers)
    this.promptController = new PromptController(this.processTextPromptUseCase);
    this.configController = new ConfigController(this.manageApiConfigUseCase);
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  getPromptController(): PromptController {
    return this.promptController;
  }

  getConfigController(): ConfigController {
    return this.configController;
  }
} 