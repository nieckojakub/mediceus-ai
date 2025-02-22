from elevenlabs import ElevenLabs


class ElevenLabsService:
    def __init__(self, key):
        self.client = ElevenLabs(api_key=key)

    def get_conversation(self, conversation_id):        
        response = self.client.conversational_ai.get_conversation(conversation_id=conversation_id)
        return response.json()
