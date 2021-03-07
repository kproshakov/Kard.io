from sklearn.linear_model import RidgeClassifierCV
from sklearn.model_selection import train_test_split
import sklearn.svm as svm
import numpy as np



data = np.genfromtxt('data.csv', delimiter=',')

X = data[1:, :-1]
y = data[1:, -1]

X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=0.1, shuffle=True)

model = svm.SVC(kernel='linear', C=1)
model.fit(X_train, y_train)

output = model.predict(X_test)
correct = (output == y_test).sum()
print("Accuracy: {:.2f}".format(float(correct*100)/output.shape[0]))

