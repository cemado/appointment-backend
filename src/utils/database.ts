import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { AWS_REGION } from '../commons/constants';

const client = new DynamoDBClient({ region: AWS_REGION });
export const ddbDocClient = DynamoDBDocumentClient.from(client);

export interface DatabaseInterface {
  create<T>(table: string, item: T): Promise<T>;
  getById<T>(table: string, id: string): Promise<T | null>;
  getAll<T>(table: string): Promise<T[]>;
  update<T>(table: string, id: string, updates: Partial<T>): Promise<T | null>;
  delete(table: string, id: string): Promise<boolean>;
  query<T>(table: string, filters: Record<string, any>): Promise<T[]>;
}

// Implementación en memoria para desarrollo/testing
export class InMemoryDatabase implements DatabaseInterface {
  private data: Record<string, Record<string, any>> = {};

  async create<T>(table: string, item: any): Promise<T> {
    if (!this.data[table]) {
      this.data[table] = {};
    }

    const id = item.id || uuidv4();
    const now = new Date().toISOString();
    
    const newItem = {
      ...item,
      id,
      createdAt: item.createdAt || now,
      updatedAt: now
    };

    this.data[table][id] = newItem;
    return newItem;
  }

  async getById<T>(table: string, id: string): Promise<T | null> {
    if (!this.data[table] || !this.data[table][id]) {
      return null;
    }
    return this.data[table][id];
  }

  async getAll<T>(table: string): Promise<T[]> {
    if (!this.data[table]) {
      return [];
    }
    return Object.values(this.data[table]);
  }

  async update<T>(table: string, id: string, updates: Partial<any>): Promise<T | null> {
    if (!this.data[table] || !this.data[table][id]) {
      return null;
    }

    const updatedItem = {
      ...this.data[table][id],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.data[table][id] = updatedItem;
    return updatedItem;
  }

  async delete(table: string, id: string): Promise<boolean> {
    if (!this.data[table] || !this.data[table][id]) {
      return false;
    }

    delete this.data[table][id];
    return true;
  }

  async query<T>(table: string, filters: Record<string, any>): Promise<T[]> {
    if (!this.data[table]) {
      return [];
    }

    const items = Object.values(this.data[table]);
    
    if (Object.keys(filters).length === 0) {
      return items;
    }

    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }

  // Método para obtener estadísticas de la tabla
  getTableStats(table: string): { count: number; tables: string[] } {
    return {
      count: this.data[table] ? Object.keys(this.data[table]).length : 0,
      tables: Object.keys(this.data)
    };
  }
}

// Instancia global de la base de datos
export const db = new InMemoryDatabase();