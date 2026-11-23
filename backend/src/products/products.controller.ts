import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles, RolesGuard } from '../auth/current-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { type FindProductsQuery, ProductsService } from './products.service';

interface UploadedProductImage {
  buffer: Buffer;
  mimetype: string;
}

function getImageExtension(file: UploadedProductImage) {
  const isPng =
    file.mimetype === 'image/png' &&
    file.buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg =
    file.mimetype === 'image/jpeg' &&
    file.buffer.length >= 3 &&
    file.buffer[0] === 0xff &&
    file.buffer[1] === 0xd8 &&
    file.buffer[2] === 0xff;
  const isWebp =
    file.mimetype === 'image/webp' &&
    file.buffer.length >= 12 &&
    file.buffer.toString('ascii', 0, 4) === 'RIFF' &&
    file.buffer.toString('ascii', 8, 12) === 'WEBP';

  if (isPng) return 'png';
  if (isJpeg) return 'jpg';
  if (isWebp) return 'webp';
  throw new BadRequestException('Upload a valid JPEG, PNG, or WebP image.');
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: FindProductsQuery) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post('images')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }),
  )
  async uploadImage(@UploadedFile() file?: UploadedProductImage) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('An image file is required.');
    }

    const extension = getImageExtension(file);
    const directory = join(process.cwd(), 'uploads', 'products');
    const filename = `${randomUUID()}.${extension}`;
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, filename), file.buffer, { flag: 'wx' });

    return { url: `/uploads/products/${filename}` };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}