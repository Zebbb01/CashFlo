// src/lib/services/asset.service.ts
import { prisma } from '@/lib/prisma';
import { AssetManagement, AssetPartnership, User, Company, Bank } from '@prisma/client'; // Import Prisma generated types

// Define a type for AssetManagement with included relations
type AssetWithRelations = AssetManagement & {
  company: Company;
  bank: Bank | null;
  owner: { id: string; name: string | null; email: string; } | null;
  partnerships: (AssetPartnership & { user: { id: string; name: string | null; email: string; } })[];
};

export class AssetService {
  // Update findById to return the specific type when includeRelations is true
  static async findById(id: string, includeRelations: boolean = true): Promise<AssetWithRelations | AssetManagement | null> {
    if (includeRelations) {
      return prisma.assetManagement.findUnique({
        where: { id },
        include: {
          company: true,
          bank: true,
          owner: { select: { id: true, name: true, email: true } },
          partnerships: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      }) as Promise<AssetWithRelations | null>; // Assert the return type here
    } else {
      return prisma.assetManagement.findUnique({
        where: { id },
      });
    }
  }

  static async findAll(options: { includeDeleted?: boolean } = {}) {
    return prisma.assetManagement.findMany({
      where: options.includeDeleted ? {} : { deletedAt: null },
      select: {
        id: true,
        assetType: true,
        companyId: true,
        assetName: true,
        assetValue: true,
        bankId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        company: { select: { id: true, name: true, description: true } },
        bank: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(data: {
    assetType: string;
    companyId: string;
    assetName: string;
    assetValue?: number;
    bankId?: string;
    userId: string;
  }) {
    return prisma.assetManagement.create({
      data: {
        ...data,
        assetValue: data.assetValue ?? null,
        bankId: data.bankId ?? null,
      },
      include: {
        company: true,
        bank: true,
        owner: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async update(id: string, data: Partial<{
    assetType: string;
    companyId: string;
    assetName: string;
    assetValue: number;
    bankId: string;
    userId: string;
  }>) {
    return prisma.assetManagement.update({
      where: { id },
      data,
    });
  }

  static async softDelete(id: string) {
    return prisma.assetManagement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: string) {
    return prisma.assetManagement.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  static async delete(id: string) {
    return prisma.assetManagement.delete({
      where: { id },
    });
  }

  static async checkOwnership(assetId: string, userId: string): Promise<boolean> {
    const asset = await prisma.assetManagement.findUnique({
      where: { id: assetId },
      select: { userId: true },
    });
    return asset?.userId === userId;
  }
}