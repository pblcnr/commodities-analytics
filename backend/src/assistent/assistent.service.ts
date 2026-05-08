import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from "@google/genai";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AssistentService {
    constructor(private readonly configService: ConfigService) {
        this.genAI = new GoogleGenAI({
            apiKey: this.configService.get<string>('GEMINI_API_KEY'),
        });
    }
    genAI: GoogleGenAI;

    async sendMessage(message: string) {
        try {
            const response = await this.genAI.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: message,
            });

            return response.text;
        }catch(error){
            throw error;
        }
        
    }
}
