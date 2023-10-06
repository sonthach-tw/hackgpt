import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression

X_train = pd.read_csv('train_data.csv', encoding='utf-8')
y_train = X_train['label']

vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(X_train['text'])

model = LinearRegression()
model.fit(X_train, y_train)

new_text = 'that is my company ilao vl thang son no push git ma no ko commit í tw'
new_text_vectorized = vectorizer.transform([new_text])
prediction = model.predict(new_text_vectorized)

print(prediction)
if prediction > 0.1:
  print('The text is sensitive.')
else:
  print('The text is not sensitive.')

