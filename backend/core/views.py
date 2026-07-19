from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get("identifier")
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"error": "Must provide identifier and password."}, status=status.HTTP_400_BAD_REQUEST)

        # Allow login by username or email
        from django.contrib.auth import get_user_model
        from django.db.models import Q
        User = get_user_model()
        user_obj = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier)).first()

        if user_obj:
            user = authenticate(username=user_obj.username, password=password)
            if user:
                # Return the UserSession format expected by the frontend
                return Response({
                    "user": {
                        "fullName": f"{user.first_name} {user.last_name}".strip() or user.username,
                        "companyName": user.organization.name if user.organization else "Foresight Labs",
                        "role": "Admin" if user.is_org_admin else "User",
                        "email": user.email,
                        "username": user.username,
                    }
                })

        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
