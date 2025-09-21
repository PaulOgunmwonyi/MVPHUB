import openai
from typing import Dict, List
import os
from dotenv import load_dotenv
from simple_explainer import SimpleExplainer

class ChatHandler:
    MAX_CALLS = 100 
    calls_used = 0

    def __init__(self):
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY must be set in .env file")
        
        self.openai_client = openai.OpenAI(api_key=api_key)
        self.explainer = SimpleExplainer()
        self.conversation_history = []
        self.last_prediction_data = None
        self.last_explanation = None
    
    def handle_message(self, message: str, prediction_data: Dict = None) -> Dict:
        """Route message to appropriate handler"""
        message_lower = message.lower()
        
        # Update prediction context if provided
        if prediction_data:
            self.last_prediction_data = prediction_data
            self.last_explanation = self.explainer.explain_prediction(prediction_data)
        
        # Route based on message content
        if any(keyword in message_lower for keyword in ['improve', 'better', 'increase']):
            return self._handle_improvement_question(message)
        elif any(keyword in message_lower for keyword in ['why', 'explain', 'reason']):
            return self._handle_explanation_question(message)
        elif any(keyword in message_lower for keyword in ['compare', 'baseline', 'josh allen']):
            return self._handle_comparison_question(message)
        else:
            return self._handle_general_question(message)
    
    def _handle_improvement_question(self, message: str) -> Dict:
        """Handle questions about improvement"""
        if not self.last_prediction_data:
            return {
                'response': 'Please make a prediction first, then I can suggest improvements!',
                'type': 'instruction'
            }
        
        suggestions = self.explainer.get_improvement_suggestions(self.last_prediction_data)
        
        # Create local response
        local_response = "Based on comparison to Josh Allen's 2024 MVP season, here are the top areas for improvement:\n\n"
        for i, suggestion in enumerate(suggestions, 1):
            local_response += f"{i}. {suggestion['message']}"
            if suggestion.get('target'):
                local_response += f" (Target: {suggestion['target']})"
            local_response += "\n"
        
        # Enhance with OpenAI for conversational tone
        enhanced_response = self._enhance_with_openai(message, local_response)
        
        return {
            'response': enhanced_response,
            'type': 'improvement',
            'suggestions': suggestions
        }
    
    def _handle_explanation_question(self, message: str) -> Dict:
        """Handle questions about why prediction is what it is"""
        if not self.last_explanation:
            return {
                'response': 'Please make a prediction first, then I can explain it!',
                'type': 'instruction'
            }
        
        explanation = self.last_explanation
        
        # Create technical explanation
        technical_response = f"Compared to Josh Allen's 2024 MVP season:\n\n"
        technical_response += f"Overall MVP Score: {explanation['total_score']:.2f}\n\n"
        technical_response += "Key factors:\n"
        
        for feature in explanation['feature_impacts'][:5]:
            status = "better" if feature['is_better'] else "worse"
            pct = abs(feature['percentage_diff'])
            technical_response += f"• {feature['feature']}: {feature['user_value']} vs {feature['baseline_value']} ({pct:.1f}% {status})\n"
        
        # Enhance with OpenAI
        enhanced_response = self._enhance_with_openai(message, technical_response)
        
        return {
            'response': enhanced_response,
            'type': 'explanation',
            'explanation_data': explanation
        }
    
    def _handle_comparison_question(self, message: str) -> Dict:
        """Handle questions about Josh Allen comparison"""
        if not self.last_explanation:
            return {
                'response': 'Please make a prediction first to see the Josh Allen comparison!',
                'type': 'instruction'
            }
        
        explanation = self.last_explanation
        response = f"Josh Allen 2024 MVP Baseline Comparison:\n\n"
        
        for feature in explanation['feature_impacts']:
            status = "✅" if feature['is_better'] else "❌"
            response += f"{status} {feature['feature']}: You: {feature['user_value']} | Josh: {feature['baseline_value']}\n"
        
        return {
            'response': response,
            'type': 'comparison',
            'comparison_data': explanation
        }
    
    def _handle_general_question(self, message: str) -> Dict:
        if self.calls_used >= self.MAX_CALLS:
            return {
                'response': "Sorry, daily limit reached.",
                'type': 'error'
            }
        self.calls_used += 1
        
        """Handle general NFL/MVP questions with OpenAI"""
        system_prompt = """You are an NFL MVP prediction expert. You help users understand MVP criteria and quarterback performance. Keep responses concise and focused on MVP-relevant topics. Use Josh Allen's 2024 MVP season as a reference point when relevant. If asked about non-NFL topics, politely redirect to MVP discussion."""
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",  
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return {
                'response': response.choices[0].message.content,
                'type': 'general'
            }
        except Exception as e:
            return {
                'response': 'Sorry, I had trouble processing that question. Try asking about MVP predictions or improvement suggestions!',
                'type': 'error'
            }
    
    def _enhance_with_openai(self, original_message: str, technical_response: str) -> str:
        if self.calls_used >= self.MAX_CALLS:
            return technical_response
        self.calls_used += 1

        """Enhance technical response with conversational tone"""
        system_prompt = f"""You are helping explain NFL MVP predictions using Josh Allen's 2024 MVP season as a baseline. Take this technical analysis and make it more conversational and engaging while keeping all the key information. Original question: "{original_message}" Technical analysis: "{technical_response}" """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",  
                messages=[
                    {"role": "system", "content": system_prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception:
            # Fallback to technical response if OpenAI fails
            return technical_response