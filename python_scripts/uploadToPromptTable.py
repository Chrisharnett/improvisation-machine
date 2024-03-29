import boto3
import json

# Initialize DynamoDB client
dynamodb = boto3.resource("dynamodb")
table_name = "Improvisation_Machine_Prompts"  # Replace with your DynamoDB table name
table = dynamodb.Table(table_name)

promptDictionary = [
    {"Prompt": "A minor", "Tags": ["Harmony"]},
    {"Prompt": "Bb Major", "Tags": ["Harmony"]},
    {"Prompt": "Bb minor", "Tags": ["Harmony"]},
    {"Prompt": "B Major", "Tags": ["Harmony"]},
    {"Prompt": "B minor", "Tags": ["Harmony"]},
    {"Prompt": "C Major", "Tags": ["Harmony"]},
    {"Prompt": "C minor", "Tags": ["Harmony"]},
    {"Prompt": "Db Major", "Tags": ["Harmony"]},
    {"Prompt": "Db minor", "Tags": ["Harmony"]},
    {"Prompt": "D Major", "Tags": ["Harmony"]},
    {"Prompt": "D minor", "Tags": ["Harmony"]},
    {"Prompt": "Eb Major", "Tags": ["Harmony"]},
    {"Prompt": "Eb minor", "Tags": ["Harmony"]},
    {"Prompt": "E Major", "Tags": ["Harmony"]},
    {"Prompt": "E minor", "Tags": ["Harmony"]},
    {"Prompt": "F Major", "Tags": ["Harmony"]},
    {"Prompt": "F minor", "Tags": ["Harmony"]},
    {"Prompt": "F# Major", "Tags": ["Harmony"]},
    {"Prompt": "F# minor", "Tags": ["Harmony"]},
    {"Prompt": "G Major", "Tags": ["Harmony"]},
    {"Prompt": "G minor", "Tags": ["Harmony"]},
    {"Prompt": "Ab Major", "Tags": ["Harmony"]},
    {"Prompt": "Ab minor", "Tags": ["Harmony"]},
    {"Prompt": "E Major", "Tags": ["Harmony"]},
    {"Prompt": "Staccato", "Tags": ["Rhythm", "Articulation"]},
    {"Prompt": "Legato", "Tags": ["Rhythm", "Articulation"]},
    {"Prompt": "Rhythmic Ostinato", "Tags": ["Rhythm"]},
    {"Prompt": "Low rhythm density", "Tags": ["Rhythm"]},
    {"Prompt": "High Rhythm Density", "Tags": ["Rhythm"]},
    {"Prompt": "Low and heavy melody", "Tags": ["Melody"]},
    {"Prompt": "High and driving melodies", "Tags": ["Melody"]},
    {"Prompt": "Repetitive motive", "Tags": ["Melody"]},
    {"Prompt": "Angular, through-composed melody", "Tags": ["Melody"]},
    {"Prompt": "Small range melody", "Tags": ["Melody"]},
    {"Prompt": "Build to drop out", "Tags": ["Form"]},
    {"Prompt": "Dead/no time vs breakbeat", "Tags": ["Form"]},
    {"Prompt": "Play a ballad", "Tags": ["Form"]},
    {"Prompt": "K-Pop song", "Tags": ["Form"]},
    {"Prompt": "No repetition", "Tags": ["Form"]},
    {"Prompt": "As many notes as possible", "Tags": ["Texture"]},
    {"Prompt": "softly, sweetly", "Tags": ["Texture"]},
    {"Prompt": "Noisy", "Tags": ["Texture"]},
    {"Prompt": "Electro-Space Jams", "Tags": ["Texture"]},
    {"Prompt": "Natural sounds, clean tones", "Tags": ["Texture"]},
    {"Prompt": "Drop out", "Tags": ["Dynamic"]},
    {"Prompt": "Get louder", "Tags": ["Dynamic"]},
    {"Prompt": "Get softer", "Tags": ["Dynamic"]},
    {"Prompt": "Play softly", "Tags": ["Dynamic"]},
    {"Prompt": "Powerful!", "Tags": ["Dynamic"]},
    {"Prompt": "Sudden dynamic changes", "Tags": ["Dynamic"]},
    {"Prompt": "Play a-capella", "Tags": ["Solo"]},
    {"Prompt": "Play a solo", "Tags": ["Solo"]},
    {"Prompt": "Trio", "Tags": ["Trio"]},
    {"Prompt": "Reggae", "Tags": ["Style"]},
    {"Prompt": "PunkJazz", "Tags": ["Style"]},
    {"Prompt": "IMPENDING DOOM", "Tags": ["Style"]},
    {"Prompt": "Hail the conquering hero", "Tags": ["Style"]},
    {"Prompt": "Old timey swing", "Tags": ["Style"]},
    {"Prompt": "Start 1 at a time.", "Tags": ["Start", "Start Only"]},
    {"Prompt": "Fade out", "Tags": ["End", "End Only"]},
    {"Prompt": "Vamp to ending", "Tags": ["End", "End Only"]},
]

# Insert data into DynamoDB
for item in promptDictionary:
    table.put_item(Item=item)
