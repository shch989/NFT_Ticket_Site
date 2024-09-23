import pyautogui

# 현재 마우스 좌표 가져오기
x, y = pyautogui.position()
print(f"마우스 현재 위치: X={x}, Y={y}")
