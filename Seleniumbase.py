from gologin import GoLogin
from seleniumbase import SB
import random
import pyautogui

API_KEY = "Gologin API Key"  # Replace with your actual GoLogin API key
PROFILE_IDS = [
    '686d5466e0b503479e34cb1e',
    '686d5466e0b503479e34cb1f',
]
BASE_DEBUG_PORT = 52604

def random_clicks(sb, num_clicks=2):
    try:
        body_size = sb.get_element_size("body") 
    except Exception:
        body_size = sb.get_window_size() 
    max_x = body_size["width"] - 1
    max_y = body_size["height"] - 1
    for _ in range(num_clicks):
        offset_x = random.randint(0, max_x)
        offset_y = random.randint(0, max_y)
        sb.click_with_offset("body", offset_x, offset_y)
        sb.sleep(random.uniform(0.5, 1.5))

def popup(sb):
    selectors = [
        'a:contains("accept and continue")',
        'a:contains("Accept and Continue")',
        'div:contains("accept and continue")',
        'div:contains("Accept and Continue")',
        'button:contains("accept and continue")',
        'button:contains("Accept and Continue")',
        'a:contains("Add Extension")',
        'a:contains("add extension")',
        'a:contains("Add")',
        'a:contains("add")',
        'button:contains("Add Extension")',
        'button:contains("add extension")',
        'div:contains("Add Extension")',
        'div:contains("add extension")',
    ]

    for selector in selectors:
        if sb.is_element_visible(selector):
            sb.click(selector)
            return True
    return False

def ad(sb):
    selectors = [
        'a:contains("accept and continue")',
        'a:contains("Accept and Continue")',
        'div:contains("accept and continue")',
        'div:contains("Accept and Continue")',
        'button:contains("accept and continue")',
        'button:contains("Accept and Continue")',
        'a:contains("Add Extension")',
        'a:contains("add extension")',
        'a:contains("Add")',
        'a:contains("add")',
        'button:contains("Add Extension")',
        'button:contains("add extension")',
        'div:contains("Add Extension")',
        'div:contains("add extension")',
    ]

    for selector in selectors:
        if sb.is_element_visible(selector):
            sb.click(selector)
            return True
    return False

def webstore(sb):
    sb.click('button:contains("Add to Chrome")', timeout=30)
    sb.sleep(4)
    pyautogui.press('tab')
    pyautogui.press('enter')
    sb.assert_element('button:contains("Remove from Chrome")', timeout=30)


def process_profile(profile_id: str, debug_port: int):
    gl = GoLogin({
        "token": API_KEY,
        "profile_id": profile_id,
        "port": debug_port,
        "writeCookesFromServer": True,
        "uploadCookiesToServer": False,
        "extra_params": [
                    "--disable-popup-blocking",
                    "--load-extension=/path to dir/adblock",
                ]
    })
    ws_url = gl.start()
    try:

        with SB(uc=True, headless=True ,cft=True, chromium_arg=[f"--remote-debugging-port={debug_port}"]) as sb:
            main_url = "https:example.com"  # Replace with the actual URL you want to visit
            sb.activate_cdp_mode(main_url)
            sb.wait_for_ready_state_complete()
            random_clicks(sb, num_clicks=2)
            sb.sleep(2)
            title = sb.get_title()
            url= sb.get_current_url()
            if "Popup" in title:
                popup(sb)
            elif "Ad Block" in title or "AdBlock" in title or "Ad" in title:
                ad(sb)
            else:
                return
            sb.sleep(3)
            if "chromewebstore" in url:
                webstore(sb)
    except Exception as e:
        print(f"[✖] Profile {profile_id} encountered an error: {e}")
    finally:
        gl.stop()
        print(f"[ℹ] Profile {profile_id} stopped (port {debug_port})")


if __name__ == "__main__":
    for idx, pid in enumerate(PROFILE_IDS):
        port = BASE_DEBUG_PORT + idx
        print(f"\n--- Starting profile {idx + 1}/{len(PROFILE_IDS)}: {pid} on port {port} ---")
        process_profile(pid, port)