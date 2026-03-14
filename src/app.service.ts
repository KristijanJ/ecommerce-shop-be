import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    // this.logger.verbose({ foo: 'bar' }, 'baz %s', 'qux');
    // this.logger.debug('foo %s %o', 'bar', { baz: 'qux' });
    this.logger.log('foo');

    return 'Hello World!';
  }
}
