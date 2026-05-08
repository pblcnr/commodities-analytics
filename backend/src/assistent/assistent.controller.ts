import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { AssistentService } from './assistent.service';

@Controller('assistent')
export class AssistentController {

    constructor(private readonly assistentService: AssistentService) {}

    @Post('message')
    async sendMessage(@Body() message: {message: string}){
        try{
            const response = await this.assistentService.sendMessage(message.message);
            return { response };
        }catch(error){
            throw error;
        }
    }
}
