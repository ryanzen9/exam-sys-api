import { SetMetadata } from '@nestjs/common';

export const Auth = () => SetMetadata('require-login', true);
