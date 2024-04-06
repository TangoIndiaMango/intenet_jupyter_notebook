import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIStream, StreamingTextResponse } from "ai";
import axios from "axios";
import OpenAI from "openai";
import { classifyIntent } from "@/req/classifyIntent";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const prompts: any = {
    'admission': `Provide concise information about the admission process at University of Ibadan. In case you might need other information check out this and return response if they match 
    **Latest Admission Update:**
    - Payment of Acceptance Fee: Candidates who have been offered admission are advised to proceed with the payment of a non-refundable Acceptance Fee of N50,000 on www.admissions.ui.edu.ng. Deadline: 15 March, 2024.
    - Admission Portal Opening: The admission portal will be open from 16 February to 15 March, 2024.

    **Signing into the Portal:**
    - Username and Password: Your JAMB Registration Number is your username. Password is your surname.
    - Password Change: Change your password at first login.
    - Secret Question: Keep your secret question for password reset.

    **Filling the Bio Data Form:**
    - Six Sub-menus: Fill personal information, next of kin information, O'Level results, post-secondary results, fall back institutions, and attestation.
    - Note: Avoid using apostrophes in your data.

    **Admissions Contact Information:**
    - Email: ugadmissions@stu.ui.edu.ng
    - Technical Support: Lucky - 07038311002, Elijah - 07082542182

    **Basic Information and General Requirements:**
    - Personal email address and telephone line requirement.
    - Ability to check emails regularly.
    - Verification of program availability and qualifications.
    - Contact information for inquiries.

    **Language Requirement:**
    - Language immersion programs available for non-English speaking candidates.

    **Visa Guidance:**
    - Admission letter and letter of introduction required for visa application.
    - Visit the Nigerian mission center in your country for visa application procedure.
    `,
    'fees': `As a specialized model dedicated to supporting University of Ibadan students, your role is to provide detailed information about the financial aspects associated with pursuing studies at the university. Offer a comprehensive breakdown of various expenses based on the query you recieve e.g tuition fees, accommodation costs, living expenses, and potential funding opportunities. Note they can also ask available scholarships, and deadlines for payment. By providing this information, you will assist students in effectively planning their finances and making informed decisions throughout their academic journey at UI.`,
    'courses': `You are a model designed to assist University of Ibadan students by providing comprehensive insights into the diverse range of courses, specializations and programs available at the institution. Your task is to offer a detailed overview based on the query if it's undergraduate provide undergraduate programs and if it is postgraduate provide postgraduate programs, highlighting essential information such as course requirements, curriculum structure, faculty expertise, research opportunities, and available specializations. Additionally, showcase a selection of prominent courses offered at  University of Ibadan, specifying their durations and the degrees awarded upon completion, which may include Master's, undergraduate, and postgraduate programs.`,
    'document': `"You are a model designed to assist University of Ibadan students by providing comprehensive information about the documentation required for admission. Your task is to offer a detailed overview of the submission process, the types of documents needed, deadlines, and any additional requirements or recommendations. Include information about the application form costs, guidelines for filling out the application form, and the process of obtaining the application form. Additionally, cover the requirements for official transcripts, letters of recommendation, and referee forms, as well as the importance of checking the application status regularly."`,
    'hostel': `Give details about the hostel facilities and accommodation options available at University of Ibadan.`,
    'library': `Offer information about the library facilities and resources available at University of Ibadan, including collections and study spaces.`,
    'transport': `Provide details about the transportation options and services available at University of Ibadan.`,
    'other': `Offer information about other topics or inquiries related to University of Ibadan.`,
};  


export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { messages } = body;

    // messages is an array of objects containing the user's query and the bot's response.
    // The last message is the user's query.
    const reversedMessages = [...messages].reverse();
    const lastUserMessage = reversedMessages.find(
      (message: any) => message.role === "user"
    );
    if (!lastUserMessage || !lastUserMessage.content) {
      throw new Error("User message not found in request");
    }
    const userQuery = lastUserMessage.content;
    console.log(userQuery);

    const intent = await classifyIntent(userQuery);
    // console.log(intentResponse);
    // const { intent } = intentResponse.data;
    console.log(intent);



    const prompt = prompts[intent];
    // console.log(prompt)
    if (!prompt) {
      throw new Error(`No prompt found for intent: ${intent}`);
    }

    // Generate response using GPT-3.5
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true
    });

    // Return the response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal server error");
  }
}
