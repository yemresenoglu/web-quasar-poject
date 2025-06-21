/**
 * Extension System (Inspired by VS Code)
 */

export interface IExtensionManifest {
  name: string;
  version: string;
  displayName: string;
  description: string;
  main?: string;
  contributes?: {
    commands?: ICommandContribution[];
    menus?: IMenuContribution[];
    views?: IViewContribution[];
  };
}

export interface ICommandContribution {
  command: string;
  title: string;
  category?: string;
}

export interface IMenuContribution {
  command: string;
  when?: string;
  group?: string;
}

export interface IViewContribution {
  id: string;
  name: string;
  when?: string;
}

export interface IExtension {
  manifest: IExtensionManifest;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}

export class ExtensionService {
  private readonly _extensions = new Map<string, IExtension>();
  private readonly _commands = new Map<string, Function>();

  async loadExtension(manifest: IExtensionManifest): Promise<void> {
    if (this._extensions.has(manifest.name)) {
      console.warn(`Extension ${manifest.name} is already loaded`);
      return;
    }

    try {
      // Load extension module
      if (manifest.main) {
        const extensionModule = await import(manifest.main);
        const extension: IExtension = {
          manifest,
          activate: extensionModule.activate || (() => Promise.resolve()),
          deactivate: extensionModule.deactivate || (() => Promise.resolve())
        };

        this._extensions.set(manifest.name, extension);
        await extension.activate();

        // Register contributions
        this._registerContributions(manifest);
        
        console.log(`Extension ${manifest.displayName} loaded successfully`);
      }
    } catch (error) {
      console.error(`Failed to load extension ${manifest.name}:`, error);
    }
  }

  private _registerContributions(manifest: IExtensionManifest): void {
    if (manifest.contributes?.commands) {
      manifest.contributes.commands.forEach(command => {
        this._commands.set(command.command, () => {
          console.log(`Executing command: ${command.command}`);
        });
      });
    }
  }

  executeCommand(commandId: string, ...args: any[]): void {
    const command = this._commands.get(commandId);
    if (command) {
      command(...args);
    } else {
      console.warn(`Command ${commandId} not found`);
    }
  }

  getExtensions(): IExtension[] {
    return Array.from(this._extensions.values());
  }
}

export const extensionService = new ExtensionService(); 