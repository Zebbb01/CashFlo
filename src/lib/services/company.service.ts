// src/lib/services/company.service.ts
import { prisma } from '@/lib/prisma';
import { Company, AssetManagement } from '@prisma/client';

// Define a type for Company with included relations
type CompanyWithAssets = Company & {
  assets: AssetManagement[];
};

export class CompanyService {
  static async findById(id: string): Promise<CompanyWithAssets | null> {
    return prisma.company.findUnique({
      where: { id },
      include: {
        assets: true, // Include related assets
      },
    });
  }

  static async findAll(): Promise<Company[]> {
    return prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      // You can include assets here too if needed for the "all" endpoint
      // include: {
      //   assets: true,
      // },
    });
  }

  static async create(data: { name: string; description?: string }): Promise<Company> {
    return prisma.company.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
  }

  static async update(id: string, data: Partial<{ name: string; description: string }>): Promise<Company> {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.company.delete({
      where: { id },
    });
  }
}